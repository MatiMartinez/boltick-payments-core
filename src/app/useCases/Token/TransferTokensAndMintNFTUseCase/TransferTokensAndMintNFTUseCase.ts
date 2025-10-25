import { ITransferTokensAndMintNFTUseCase, ITransferTokensAndMintNFTUseCaseInput, ITransferTokensAndMintNFTUseCaseOutput, ITicketTypeInfo } from "./interface";

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

  async execute(input: ITransferTokensAndMintNFTUseCaseInput): Promise<ITransferTokensAndMintNFTUseCaseOutput> {
    try {
      this.validateInput(input);

      const currentTime = Date.now();
      const transferIds: string[] = [];
      let totalTickets = 0;

      // Procesar cada tipo de ticket
      for (const ticketType of input.ticketTypes) {
        // Crear una transferencia por cada tipo de ticket
        for (let i = 0; i < ticketType.quantity; i++) {
          const transferId = uuid();
          transferIds.push(transferId);
          totalTickets++;

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
            ticketTypeId: ticketType.ticketTypeId,
          });

          // Preparar mensaje para SQS
          const sqsMessage = {
            transferId: transfer.id,
            userId: transfer.userId,
            walletAddress: transfer.walletAddress,
            eventId: transfer.eventId,
            ticketTypeId: ticketType.ticketTypeId,
          };

          // Enviar mensaje a SQS
          await this.sqsService.sendMessage(transfer.eventId, sqsMessage);

          this.logger.info("[TransferTokensAndMintNFTUseCase] Message sent to SQS for async processing", {
            transferId,
            ticketTypeId: ticketType.ticketTypeId,
          });
        }
      }

      return {
        success: 1,
        message: `Transferencias iniciadas correctamente. Se procesarán ${totalTickets} tickets de ${
          input.ticketTypes.length
        } tipos diferentes. Transfer IDs: ${transferIds.join(", ")}`,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error("[TransferTokensAndMintNFTUseCase] Error processing transfers", {
        error: err.message,
        input,
      });

      return {
        success: 0,
        message: `Error al procesar las transferencias: ${err.message}`,
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
    if (!input.ticketTypes || !Array.isArray(input.ticketTypes) || input.ticketTypes.length === 0) {
      throw new Error("ticketTypes must be a non-empty array");
    }

    for (const ticketType of input.ticketTypes) {
      if (!ticketType.ticketTypeId) {
        throw new Error("ticketTypeId is required for each ticket type");
      }
      if (!ticketType.quantity || ticketType.quantity <= 0) {
        throw new Error("quantity must be greater than 0 for each ticket type");
      }
    }
  }
}
