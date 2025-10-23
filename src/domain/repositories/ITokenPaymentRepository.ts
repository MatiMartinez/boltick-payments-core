import { TokenPaymentEntity } from "@domain/entities/TokenPaymentEntity";

export interface ITokenPaymentRepository {
  createTokenPayment(tokenPayment: TokenPaymentEntity): Promise<void>;
}
