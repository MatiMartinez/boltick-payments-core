export interface ITransferTokensAndMintNFTUseCase {
  execute(input: ITransferTokensAndMintNFTUseCaseInput): Promise<ITransferTokensAndMintNFTUseCaseOutput>;
}

export interface ITransferTokensAndMintNFTUseCaseInput {
  userId: string;
  walletAddress: string;
  eventId: string;
  tokenId: string;
  tokenAmount: number;
  ticketTypes: ITicketTypeInfo[];
}

export interface ITicketTypeInfo {
  ticketTypeId: string;
  quantity: number;
}

export interface ITransferTokensAndMintNFTUseCaseOutput {
  success: number;
  message: string;
}
