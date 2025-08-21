import { TicketEntity } from "@domain/entities/TicketEntity";

export interface ITicketRepository {
  findByTicketNumber(ticketNumber: string): Promise<TicketEntity | null>;
  findByWalletAddress(walletAddress: string): Promise<TicketEntity[]>;
  update(ticket: TicketEntity): Promise<void>;
}
