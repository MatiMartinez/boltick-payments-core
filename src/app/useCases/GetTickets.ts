import { Ticket } from '@domain/Ticket';
import { S3Service } from '@services/S3/S3Service';
import { SolanaService } from '@services/Solana/SolanaService';

export class GetTicketsUseCase {
  constructor(
    private S3Service: S3Service,
    private SolanaService: SolanaService
  ) {}

  async execute(input: string): Promise<Ticket[]> {
    const tokens = await this.SolanaService.getTokens(input);

    const uris = tokens.map((token) => this.extractFileKey(token.uri));

    const jsons = await this.S3Service.getMultipleJsonFiles('boltick-metadata', uris);

    const tickets: Ticket[] = [];

    tokens.forEach((token) => {
      const json = jsons.find((json) => json.fileKey === this.extractFileKey(token.uri));

      if (json) {
        tickets.push({
          payment: {
            eventId: json.content.payment.eventId,
          },
          nft: json.content.nft,
          createdAt: json.content.createdAt,
          imageUrl: json.content.imageUrl,
          used: json.content.used,
          useDate: json.content.useDate,
        });
      }
    });

    return tickets;
  }

  private extractFileKey(uri: string): string {
    const [_, ...fileParts] = uri.split('/');
    return fileParts.join('/');
  }
}
