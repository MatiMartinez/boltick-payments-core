import { PaymentModel } from "@models/PaymentModel";
import { PaymentEntity, Status } from "@domain/entities/PaymentEntity";

export class PaymentRepository {
  async getPaymentById(id: string): Promise<PaymentEntity> {
    const response = await PaymentModel.query("id").eq(id).using("idIndex").exec();
    return response[0];
  }

  async createPayment(payment: PaymentEntity): Promise<PaymentEntity> {
    return await PaymentModel.create(payment);
  }

  async updatePaymentCallbackStatus(userId: string, createdAt: number, callbackStatus: Status): Promise<PaymentEntity> {
    return await PaymentModel.update({ userId, createdAt }, { callbackStatus });
  }
}
