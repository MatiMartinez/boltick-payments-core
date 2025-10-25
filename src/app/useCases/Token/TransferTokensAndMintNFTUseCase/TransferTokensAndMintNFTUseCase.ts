import {
  ITransferTokensAndMintNFTUseCase,
  ITransferTokensAndMintNFTUseCaseInput,
  ITransferTokensAndMintNFTUseCaseOutput,
} from "./interface";

import { ILogger } from "@commons/Logger/interface";
import { ISQSService } from "@services/SQS/interface";
import { ITokenTransferRepository } from "@domain/repositories/ITokenTransferRepository";
import { TokenTransferEntity } from "@domain/entities/TokenTransferEntity";
import { v4 as uuid } from "uuid";

export class TransferTokensAndMintNFTUseCase implements ITransferTokensAndMintNFTUseCase {
  constructor(
    private tokenTransferRepository: ITokenTransferRepository,
    private sqsService: ISQSService,
    private logger: ILogger
  ) {}

  async execute(
    input: ITransferTokensAndMintNFTUseCaseInput
  ): Promise<ITransferTokensAndMintNFTUseCaseOutput> {
    try {
      // Validar entrada
      this.validateInput(input);

      const currentTime = Date.now();
      const transferId = uuid();

      // Crear la entidad de transferencia
      const transfer: TokenTransferEntity = {
        id: transferId,
        userId: input.userId,
        walletAddress: input.walletAddress,
        eventId: input.eventId,
        tokenId: input.tokenId,
        tokenAmount: input.tokenAmount,
        transactionStatus: "Pending",
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      // Guardar en DynamoDB
      await this.tokenTransferRepository.create(transfer);
      this.logger.info("[TransferTokensAndMintNFTUseCase] Transfer saved to database", {
        transferId,
      });

      // Preparar mensaje para SQS
      // Este mensaje será consumido por otra Lambda Worker que ejecutará la transferencia real en Solana
      const sqsMessage = {
        transferId: transfer.id,
        userId: transfer.userId,
        walletAddress: transfer.walletAddress,
        eventId: transfer.eventId,
        ticketTypeId: input.ticketTypeId,
      };

      // Enviar mensaje a SQS
      // La otra Lambda Worker consumirá este mensaje y ejecutará la lógica de transfer + mint en Solana
      await this.sqsService.sendMessage(
        transfer.eventId, // MessageGroupId para FIFO queues
        sqsMessage
      );

      this.logger.info(
        "[TransferTokensAndMintNFTUseCase] Message sent to SQS for async processing",
        {
          transferId,
        }
      );

      return {
        success: 1,
        message: "Transferencia iniciada correctamente. El proceso se completará en breve.",
        data: {
          transferId,
        },
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error("[TransferTokensAndMintNFTUseCase] Error processing transfer", {
        error: err.message,
        input,
      });

      return {
        success: 0,
        message: `Error al procesar la transferencia: ${err.message}`,
      };
    }
  }

  private validateInput(input: ITransferTokensAndMintNFTUseCaseInput): void {
    if (!input.userId) {
      throw new Error("userId is required");
    }
    if (!input.walletAddress) {
      throw new Error("walletAddress is required");
    }
    if (!input.eventId) {
      throw new Error("eventId is required");
    }
    if (!input.tokenAmount || input.tokenAmount <= 0) {
      throw new Error("tokenAmount must be greater than 0");
    }
  }
}
