import { TokenPaymentEntity } from "@domain/entities/TokenPaymentEntity";

export type CreateTokenPaymentInput = Pick<TokenPaymentEntity, "userId" | "walletPublicKey" | "provider"> & {
  amount: number;
};

export interface CreateTokenPaymentOutput {
  success: number;
  message: string;
  data?: { url: string };
}
