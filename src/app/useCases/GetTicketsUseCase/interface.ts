import { TicketEntity } from "@domain/entities/TicketEntity";

export interface GetTicketsInput {
  walletAddress: string;
}

export interface GetTicketsOutput {
  tickets: UserTicket[];
}

export type UserTicket = Omit<TicketEntity, "metadataUrl" | "walletAddress">;
