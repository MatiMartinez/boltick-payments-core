import { TokenTransferEntity } from "@domain/entities/TokenTransferEntity";

export interface ITokenTransferRepository {
  create(transfer: TokenTransferEntity): Promise<TokenTransferEntity>;
}
