export interface ITransferTokensAndMintNFTUseCase {
  execute(
    input: ITransferTokensAndMintNFTUseCaseInput
  ): Promise<ITransferTokensAndMintNFTUseCaseOutput>;
}

export interface ITransferTokensAndMintNFTUseCaseInput {
  eventId: string;
  ticketTypes: ITicketTypeInfo[];
  tokenId: string;
  walletAddress: string;
}

export interface ITicketTypeInfo {
  quantity: number;
  ticketTypeId: string;
  tokenAmount: number;
}

export interface ITransferTokensAndMintNFTUseCaseOutput {
  success: number;
  message: string;
}
