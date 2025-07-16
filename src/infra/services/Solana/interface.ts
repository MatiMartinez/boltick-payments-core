export interface ISolanaService {
  getMyNFTsFromWallet(walletAddress: string): Promise<UserNFT[]>;
}

export interface UserNFT {
  address: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url: string;
}
