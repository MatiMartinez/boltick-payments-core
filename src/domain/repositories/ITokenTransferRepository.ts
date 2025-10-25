import { TokenTransferEntity, TransactionStatus } from "@domain/entities/TokenTransferEntity";

export interface ITokenTransferRepository {
  create(transfer: TokenTransferEntity): Promise<void>;
  findById(id: string): Promise<TokenTransferEntity | null>;
  updateStatus(
    userId: string,
    createdAt: number,
    status: TransactionStatus,
    transactionHash?: string
  ): Promise<void>;
  findByWallet(walletAddress: string): Promise<TokenTransferEntity[]>;
}
