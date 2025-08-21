import { TicketEntity } from "@domain/entities/TicketEntity";

export interface IGetTicketsByWalletUseCase {
  execute(input: GetTicketsByWalletInput): Promise<GetTicketsByWalletOutput>;
}

export interface GetTicketsByWalletInput {
  walletAddress: string;
}

export interface GetTicketsByWalletOutput {
  success: number;
  message: string;
  data: UserTicket[];
}

export type UserTicket = Omit<TicketEntity, "metadataUrl" | "walletAddress" | "entryCode" | "entryCodeExpiresAt">;
