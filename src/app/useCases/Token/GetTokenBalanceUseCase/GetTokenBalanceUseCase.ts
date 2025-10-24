import {
  IGetTokenBalanceUseCase,
  IGetTokenBalanceUseCaseInput,
  IGetTokenBalanceUseCaseOutput,
} from "./interface";
import { ISolanaService } from "@services/Solana/interface";

export class GetTokenBalanceUseCase implements IGetTokenBalanceUseCase {
  constructor(private solanaService: ISolanaService) {}

  public async execute(
    input: IGetTokenBalanceUseCaseInput
  ): Promise<IGetTokenBalanceUseCaseOutput> {
    try {
      if (!input.walletAddress) {
        throw new Error("Wallet address is required");
      }

      const balance = await this.solanaService.getBOLTBalance(input.walletAddress);

      return {
        success: 1,
        message: "Balance obtenido correctamente",
        data: {
          balance,
        },
      };
    } catch (error) {
      const err = error as Error;
      console.error(`Error in GetTokenBalanceUseCase: ${err.message}`);

      return {
        success: 0,
        message: `Error al obtener el balance: ${err.message}`,
      };
    }
  }
}
