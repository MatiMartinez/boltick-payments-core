import { Payment } from '@domain/Payment';
import { UpdatePaymentDTO } from '@dtos/UpdatePayment';
import { PaymentRepository } from '@repositories/PaymentRepository';

export class UpdatePaymentUseCase {
  constructor(private PaymentRepository: PaymentRepository) {}

  async execute(input: UpdatePaymentDTO): Promise<Payment> {
    const payment = await this.PaymentRepository.getPaymentById(input.id);
    if (payment.callbackStatus !== 'Pending') return payment;

    const updatedPayment = await this.PaymentRepository.updatePaymentCallbackStatus(
      payment.userId,
      payment.createdAt,
      input.callbackStatus
    );

    return updatedPayment;
  }
}
