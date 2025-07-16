import { Ticket } from "@domain/Ticket";

export interface GetTicketsInput {
  walletAddress: string;
}

export interface GetTicketsOutput {
  tickets: Ticket[];
}
