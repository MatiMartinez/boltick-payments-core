export interface ITransferTokensAndMintNFTUseCase {
  execute(
    input: ITransferTokensAndMintNFTUseCaseInput
  ): Promise<ITransferTokensAndMintNFTUseCaseOutput>;
}

export interface ITransferTokensAndMintNFTUseCaseInput {
  userId: string;
  walletAddress: string;
  eventId: string;
  tokenId: string;
  tokenAmount: number;
  ticketTypeId: string;
}

export interface ITransferTokensAndMintNFTUseCaseOutput {
  success: number;
  message: string;
  data?: {
    transferId: string;
  };
}
