export interface IGenerateEntryUseCase {
  execute(input: IGenerateEntryUseCaseInput): Promise<IGenerateEntryUseCaseOutput>;
}

export interface IGenerateEntryUseCaseInput {
  ticketNumber: string;
}

export interface IGenerateEntryUseCaseOutput {
  data: { token: string };
  result: number;
  message: string;
}
