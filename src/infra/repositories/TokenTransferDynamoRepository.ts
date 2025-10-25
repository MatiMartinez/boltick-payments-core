import { TokenTransferEntity, TransactionStatus } from "@domain/entities/TokenTransferEntity";

import { ILogger } from "@commons/Logger/interface";
import { ITokenTransferRepository } from "@domain/repositories/ITokenTransferRepository";
import { TokenTransferModel } from "@models/TokenTransferModel";

export class TokenTransferDynamoRepository implements ITokenTransferRepository {
  constructor(private logger: ILogger) {}

  async create(transfer: TokenTransferEntity): Promise<void> {
    try {
      await TokenTransferModel.create(transfer);
      this.logger.info("[TokenTransferDynamoRepository] Token transfer created successfully", {
        transferId: transfer.id,
      });
    } catch (error) {
      this.logger.error("[TokenTransferDynamoRepository] Error creating token transfer", {
        transfer,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<TokenTransferEntity | null> {
    try {
      const response = await TokenTransferModel.query("id").eq(id).using("idIndex").exec();
      return response[0] || null;
    } catch (error) {
      this.logger.error("[TokenTransferDynamoRepository] Error finding token transfer by id", {
        id,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async updateStatus(
    userId: string,
    createdAt: number,
    status: TransactionStatus,
    transactionHash?: string
  ): Promise<void> {
    try {
      const updateData: {
        transactionStatus: TransactionStatus;
        updatedAt: number;
        transactionHash?: string;
      } = {
        transactionStatus: status,
        updatedAt: Date.now(),
      };

      if (transactionHash) {
        updateData.transactionHash = transactionHash;
      }

      await TokenTransferModel.update({ userId, createdAt }, updateData);
      this.logger.info("[TokenTransferDynamoRepository] Token transfer status updated", {
        userId,
        createdAt,
        status,
      });
    } catch (error) {
      this.logger.error("[TokenTransferDynamoRepository] Error updating token transfer status", {
        userId,
        createdAt,
        status,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async findByWallet(walletAddress: string): Promise<TokenTransferEntity[]> {
    try {
      const response = await TokenTransferModel.query("walletAddress")
        .eq(walletAddress)
        .using("walletAddressIndex")
        .exec();
      return response;
    } catch (error) {
      this.logger.error("[TokenTransferDynamoRepository] Error finding token transfers by wallet", {
        walletAddress,
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
