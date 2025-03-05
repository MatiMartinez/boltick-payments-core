import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

import { NFT } from './interface';

export class SolanaService {
  private connection: Connection;

  constructor(rpcEndpoint: string) {
    this.connection = new Connection(rpcEndpoint, 'confirmed'); // testnet
  }

  async getTokens(walletAddress: string): Promise<NFT[]> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const metaplex = Metaplex.make(this.connection);
      const creatorPublicKey = this.getCreatorPublicKey();

      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      const filteredTokens: NFT[] = [];

      for (const account of tokenAccounts.value) {
        const mintAddress = new PublicKey(account.account.data.parsed.info.mint);

        try {
          const nft = await metaplex.nfts().findByMint({ mintAddress });

          const isMine = nft.creators?.some((creator) => creator.address.equals(creatorPublicKey));

          if (isMine) {
            filteredTokens.push({
              mint: mintAddress.toString(),
              name: nft.name,
              symbol: nft.symbol,
              uri: nft.uri,
              collectionAddress: nft.collection?.address.toString() || '',
            });
          }
        } catch (error) {}
      }

      console.log('Tokens successfully obtained: ', JSON.stringify(filteredTokens, null, 2));

      return filteredTokens;
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
      throw new Error('Error obtaining tokens.');
    }
  }

  private getCreatorPublicKey(): PublicKey {
    const creatorPublicKey = new PublicKey(process.env.CREATOR_PUBLIC_KEY as string);
    return creatorPublicKey;
  }
}
