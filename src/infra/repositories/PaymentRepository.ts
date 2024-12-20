import { PaymentModel } from '@models/Payment';
import { Payment, Status } from '@domain/Payment';

export class PaymentRepository {
  async getPaymentById(id: string): Promise<Payment> {
    const response = await PaymentModel.query('id').eq(id).using('idIndex').exec();
    return response[0];
  }

  async createPayment(payment: Payment): Promise<Payment> {
    return await PaymentModel.create(payment);
  }

  async updatePaymentCallbackStatus(userId: string, createdAt: number, callbackStatus: Status): Promise<Payment> {
    return await PaymentModel.update({ userId, createdAt }, { callbackStatus });
  }
}
