import { PaymentModel } from "@models/PaymentModel";
import { PaymentEntity, Status } from "@domain/entities/PaymentEntity";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { ILogger } from "@commons/Logger/interface";

export class PaymentDynamoRepository implements IPaymentRepository {
  constructor(private logger: ILogger) {}

  async getPaymentById(id: string) {
    try {
      const response = await PaymentModel.query("id").eq(id).using("idIndex").exec();
      return response[0];
    } catch (error) {
      this.logger.error("[PaymentDynamoRepository] Error al buscar el pago por id", { id, error: (error as Error).message });
      throw error;
    }
  }

  async createPayment(payment: PaymentEntity) {
    try {
      await PaymentModel.create(payment);
    } catch (error) {
      this.logger.error("[PaymentDynamoRepository] Error al crear el pago", { payment, error: (error as Error).message });
      throw error;
    }
  }

  async updatePaymentCallbackStatus(userId: string, createdAt: number, callbackStatus: Status) {
    try {
      await PaymentModel.update({ userId, createdAt }, { callbackStatus });
    } catch (error) {
      this.logger.error("[PaymentDynamoRepository] Error al actualizar el estado de callback del pago", {
        userId,
        createdAt,
        callbackStatus,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async getPaymentsByWallet(walletPublicKey: string) {
    try {
      const response = await PaymentModel.query("walletPublicKey").eq(walletPublicKey).using("walletPublicKeyIndex").exec();
      return response;
    } catch (error) {
      this.logger.error("[PaymentDynamoRepository] Error al buscar pagos por wallet", {
        walletPublicKey,
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
