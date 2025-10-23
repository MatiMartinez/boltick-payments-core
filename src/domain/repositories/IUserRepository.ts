import { UserEntity } from "@domain/entities/UserEntity";

export interface IUserRepository {
  getUserByEmailAndWallet(email: string, walletAddress: string): Promise<UserEntity | null>;
  checkWalletAliasExists(walletAlias: string): Promise<boolean>;
  createUser(user: UserEntity): Promise<void>;
}
