import { NFT, PaymentEntity } from "@domain/entities/PaymentEntity";

export interface ICreateFreePaymentUseCase {
  execute(input: CreateFreePaymentInput): Promise<CreateFreePaymentOutput>;
}

export type CreateFreePaymentInput = Pick<PaymentEntity, "userId" | "eventId" | "eventName" | "walletPublicKey" | "prName"> & {
  nfts: NFTInput[];
};

export type NFTInput = Pick<NFT, "collectionName" | "collectionSymbol" | "imageUrl" | "type" | "unitPrice"> & { quantity: number };

export interface CreateFreePaymentOutput {
  success: number;
  message: string;
  data?: { id: string };
}
