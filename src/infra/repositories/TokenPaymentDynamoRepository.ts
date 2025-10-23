import { TokenPaymentModel } from "@models/TokenPaymentModel";
import { TokenPaymentEntity, Status } from "@domain/entities/TokenPaymentEntity";
import { ITokenPaymentRepository } from "@domain/repositories/ITokenPaymentRepository";
import { ILogger } from "@commons/Logger/interface";

export class TokenPaymentDynamoRepository implements ITokenPaymentRepository {
  constructor(private logger: ILogger) {}

  async createTokenPayment(tokenPayment: TokenPaymentEntity) {
    try {
      await TokenPaymentModel.create(tokenPayment);
    } catch (error) {
      this.logger.error("[TokenPaymentDynamoRepository] Error al crear el pago de tokens", { tokenPayment, error: (error as Error).message });
      throw error;
    }
  }
}
