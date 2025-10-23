import { UserModel } from "@models/UserModel";
import { UserEntity } from "@domain/entities/UserEntity";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { ILogger } from "@commons/Logger/interface";

export class UserDynamoRepository implements IUserRepository {
  constructor(private logger: ILogger) {}

  async getUserByEmailAndWallet(email: string, walletAddress: string): Promise<UserEntity | null> {
    try {
      const response = await UserModel.query("email").eq(email).where("walletAddress").eq(walletAddress).exec();
      return response[0] || null;
    } catch (error) {
      this.logger.error("[UserDynamoRepository] Error al buscar usuario por email y walletAddress", {
        email,
        walletAddress,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async checkWalletAliasExists(walletAlias: string): Promise<boolean> {
    try {
      const response = await UserModel.query("walletAlias").eq(walletAlias).using("walletAliasIndex").exec();
      return response.length > 0;
    } catch (error) {
      this.logger.error("[UserDynamoRepository] Error al verificar si walletAlias existe", {
        walletAlias,
        error: (error as Error).message,
      });
      throw error;
    }
  }

  async createUser(user: UserEntity): Promise<void> {
    try {
      await UserModel.create(user);
      return;
    } catch (error) {
      this.logger.error("[UserDynamoRepository] Error al crear usuario", {
        user,
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
