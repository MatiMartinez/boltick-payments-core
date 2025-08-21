import { PaymentEntity, Status } from "@domain/entities/PaymentEntity";

export interface IPaymentRepository {
  getPaymentById(id: string): Promise<PaymentEntity | null>;
  createPayment(payment: PaymentEntity): Promise<void>;
  updatePaymentCallbackStatus(userId: string, createdAt: number, callbackStatus: Status): Promise<void>;
  getPaymentsByWallet(walletPublicKey: string): Promise<PaymentEntity[]>;
}
