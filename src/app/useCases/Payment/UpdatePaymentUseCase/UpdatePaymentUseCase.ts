import { UpdatePaymentInput, UpdatePaymentOutput } from "./interface";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";

export class UpdatePaymentUseCase {
  constructor(private PaymentRepository: IPaymentRepository) {}

  async execute(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const payment = await this.PaymentRepository.getPaymentById(input.id);
    if (!payment) {
      return { result: 0, message: "Pago no encontrado" };
    }
    if (payment.callbackStatus !== "Pending") {
      return { result: 0, message: "El callback ya fue procesado previamente" };
    }
    await this.PaymentRepository.updatePaymentCallbackStatus(payment.userId, payment.createdAt, input.callbackStatus);
    return { result: 1, message: "Callback actualizado correctamente" };
  }
}
