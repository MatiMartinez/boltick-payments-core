export interface TokenTransferEntity {
  id: string;
  userId: string;
  walletAddress: string;
  eventId: string;
  tokenId: string;
  tokenAmount: number;
  transactionStatus: TransactionStatus;
  transactionHash?: string;
  sqsMessageId?: string;
  createdAt: number;
  updatedAt: number;
}

export type TransactionStatus = "Pending" | "Processing" | "Completed" | "Failed";
