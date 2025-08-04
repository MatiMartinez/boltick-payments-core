export interface IGenerateEntryUseCase {
  execute(input: IGenerateEntryUseCaseInput): Promise<IGenerateEntryUseCaseOutput>;
}

export interface IGenerateEntryUseCaseInput {
  ticketNumber: string;
}

export interface IGenerateEntryUseCaseOutput {
  success: number;
  message: string;
  data?: { token: string };
}
