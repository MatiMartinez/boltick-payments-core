import { PaymentRepository } from "@repositories/PaymentRepository";
import { UpdatePaymentInput, UpdatePaymentOutput } from "./interface";

export class UpdatePaymentUseCase {
  constructor(private PaymentRepository: PaymentRepository) {}

  async execute(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const payment = await this.PaymentRepository.getPaymentById(input.id);
    if (!payment) {
      return { result: 0, message: "Pago no encontrado" };
    }
    if (payment.callbackStatus !== "Pending") {
      return { result: 0, message: "El callback ya fue procesado previamente" };
    }
    await this.PaymentRepository.updatePaymentCallbackStatus(
      payment.userId,
      payment.createdAt,
      input.callbackStatus
    );
    return { result: 1, message: "Callback actualizado correctamente" };
  }
}
