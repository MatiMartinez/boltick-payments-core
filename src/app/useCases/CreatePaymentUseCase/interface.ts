import { NFT, Payment } from "@domain/Payment";

export type CreatePaymentInput = Pick<Payment, "userId" | "eventId" | "eventName" | "walletPublicKey" | "provider" | "prName"> & {
  nfts: NFTInput[];
};

export type NFTInput = Pick<NFT, "collectionName" | "collectionSymbol" | "imageUrl" | "type" | "unitPrice"> & { quantity: number };

export interface CreatePaymentOutput {
  success: number;
  message: string;
  data?: { url: string };
}
