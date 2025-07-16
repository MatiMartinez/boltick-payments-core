import { Ticket } from "@domain/Ticket";
import { S3Service } from "@services/S3/S3Service";
import { SolanaService } from "@services/Solana/SolanaService";
import { GetTicketsInput, GetTicketsOutput } from "./interface";

export class GetTicketsUseCase {
  constructor(
    private S3Service: S3Service,
    private SolanaService: SolanaService
  ) {}

  async execute(input: GetTicketsInput): Promise<GetTicketsOutput> {
    const userNFTs = await this.SolanaService.getMyNFTsFromWallet(
      input.walletAddress
    );

    const uris = userNFTs
      .map((nft) => this.extractFileKey(nft.external_url))
      .filter((uri) => uri !== "");

    const jsons = await this.S3Service.getMultipleJsonFiles(
      "boltick-metadata",
      uris
    );

    const tickets: Ticket[] = [];

    userNFTs.forEach((nft) => {
      const json = jsons.find(
        (json) => json.fileKey === this.extractFileKey(nft.external_url)
      );

      if (json) {
        const ticket = this.mapToTicket(nft, json.content);
        tickets.push(ticket);
      }
    });

    return { tickets };
  }

  private extractFileKey(uri: string): string {
    if (!uri) return "";

    try {
      const url = new URL(uri);
      return url.pathname.substring(1);
    } catch {
      const [_, ...fileParts] = uri.split("/");
      return fileParts.join("/");
    }
  }

  private mapToTicket(nft: any, s3Content: any): Ticket {
    return {
      ticketNumber: s3Content.nft?.ticketNumber || "",
      type: s3Content.nft?.type || "",
      unitPrice: s3Content.nft?.unitPrice || 0,
      imageUrl: s3Content.imageUrl || "",

      eventId: s3Content.payment?.eventId || "",
      eventName: s3Content.nft?.collectionName || "Evento sin nombre",

      assetId: nft.address,
      collectionName: s3Content.nft?.collectionName || "",
      collectionSymbol: s3Content.nft?.collectionSymbol || "",

      createdAt: s3Content.createdAt || 0,
      used: s3Content.used || 0,
      useDate: s3Content.useDate || 0,
    };
  }
}
