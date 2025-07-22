import { NFT, Payment } from "@domain/Payment";

export type CreatePaymentInput = Pick<
  Payment,
  "userId" | "eventId" | "walletPublicKey" | "provider" | "prName"
> & {
  nfts: NFTInput[];
};

export type NFTInput = Pick<
  NFT,
  "collectionName" | "collectionSymbol" | "type" | "unitPrice"
> & { quantity: number };

export interface CreatePaymentOutput {
  url: string;
}
