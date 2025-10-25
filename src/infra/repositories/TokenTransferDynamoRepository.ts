import { ILogger } from "@commons/Logger/interface";
import { ITokenTransferRepository } from "@domain/repositories/ITokenTransferRepository";
import { TokenTransferEntity } from "@domain/entities/TokenTransferEntity";
import { TokenTransferModel } from "@models/TokenTransferModel";

export class TokenTransferDynamoRepository implements ITokenTransferRepository {
  constructor(private Logger: ILogger) {}

  async create(transfer: TokenTransferEntity): Promise<TokenTransferEntity> {
    try {
      const result = await TokenTransferModel.create(transfer);
      return result as unknown as TokenTransferEntity;
    } catch (error) {
      this.Logger.error("[TokenTransferDynamoRepository] Error al crear la transferencia", {
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
