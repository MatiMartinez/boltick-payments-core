import { ISolanaService, UserNFT } from "./interface";

export class SolanaService implements ISolanaService {
  private rpcUrl: string;
  private creatorAddress: string;

  constructor(apiKey: string) {
    this.rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;

    this.creatorAddress = process.env.CREATOR_PUBLIC_KEY as string;
    if (!this.creatorAddress) {
      throw new Error("CREATOR_PUBLIC_KEY environment variable is required");
    }
  }

  async getMyNFTsFromWallet(walletAddress: string): Promise<UserNFT[]> {
    try {
      console.log(`Getting MY cNFTs from wallet: ${walletAddress}`);
      console.log(`Filtering by creator: ${this.creatorAddress}`);

      if (!this.isValidSolanaAddress(walletAddress)) {
        throw new Error("Invalid wallet address");
      }

      const assets = await this.getAssetsByOwner(walletAddress);

      const myAssets = assets.filter((asset) => this.isCreatedByMe(asset));

      console.log(
        `Found ${assets.length} total assets, ${myAssets.length} are mine`
      );

      return myAssets.map((asset) => this.convertAssetToUserNFT(asset));
    } catch (error) {
      const err = error as Error;
      console.error(`Error getting my NFTs: ${err.message}`);
      throw new Error(`Error getting my NFTs: ${err.message}`);
    }
  }

  private async getAssetsByOwner(ownerAddress: string): Promise<any[]> {
    const payload = {
      jsonrpc: "2.0",
      id: "get-assets-by-owner",
      method: "getAssetsByOwner",
      params: {
        ownerAddress: ownerAddress,
        page: 1,
        limit: 1000,
        displayOptions: {
          showCollectionMetadata: false,
          showFungible: false,
          showNativeBalance: false,
        },
      },
    };

    console.log("Getting assets for owner:", ownerAddress);

    try {
      const response = await fetch(this.rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Helius RPC Error: ${data.error.message}`);
      }

      return data.result.items || [];
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  }

  private isCreatedByMe(asset: any): boolean {
    if (!asset.creators || !Array.isArray(asset.creators)) {
      return false;
    }

    const createdByMe = asset.creators.some(
      (creator: any) =>
        creator.address === this.creatorAddress && creator.share > 0
    );

    if (createdByMe) {
      console.log(`Asset ${asset.id} was created by me`);
    }

    return createdByMe;
  }

  private convertAssetToUserNFT(asset: any): UserNFT {
    const metadata = asset.content?.metadata || {};
    const links = asset.content?.links || {};

    return {
      address: asset.id,
      name: metadata.name || "Unknown",
      symbol: metadata.symbol || "",
      description: metadata.description || "",
      image: links.image || "",
      external_url: links.external_url || "",
    };
  }

  private isValidSolanaAddress(address: string): boolean {
    try {
      const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      return regex.test(address);
    } catch {
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log("Testing Helius connection...");

      const payload = {
        jsonrpc: "2.0",
        id: "test",
        method: "getHealth",
      };

      const response = await fetch(this.rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Connection test successful");
      return response.ok;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}
