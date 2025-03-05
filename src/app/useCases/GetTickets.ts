import { S3Service } from '@services/S3/S3Service';
import { SolanaService } from '@services/Solana/SolanaService';

export class GetTicketsUseCase {
  constructor(
    private S3Service: S3Service,
    private SolanaService: SolanaService
  ) {}

  async execute(input: string): Promise<any> {
    const tokens = await this.SolanaService.getTokens(input);

    const uris = tokens.map((token) => this.extractFileKey(token.uri));

    const jsons = await this.S3Service.getMultipleJsonFiles('boltick-metadata', uris);

    const tickets = tokens.map((token) => {
      const json = jsons.find((json) => json.fileKey === this.extractFileKey(token.uri));

      return {
        collectionAddress: token.collectionAddress,
        createdAt: json?.content?.createdAt,
        imageUrl: json?.content?.imageUrl,
        name: token.name,
        symbol: token.symbol,
        type: json?.content?.type,
        unitPrice: json?.content?.unitPrice,
      };
    });

    return tickets;
  }

  private extractFileKey(uri: string): string {
    const [_, ...fileParts] = uri.split('/');
    return fileParts.join('/');
  }
}
