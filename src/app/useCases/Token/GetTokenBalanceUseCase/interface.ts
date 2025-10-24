export interface IGetTokenBalanceUseCase {
  execute(input: IGetTokenBalanceUseCaseInput): Promise<IGetTokenBalanceUseCaseOutput>;
}

export interface IGetTokenBalanceUseCaseInput {
  walletAddress: string;
}

export interface IGetTokenBalanceUseCaseOutput {
  success: number;
  message: string;
  data?: {
    balance: number;
  };
}
