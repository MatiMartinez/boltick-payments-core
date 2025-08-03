import { TicketEntity } from "@domain/entities/TicketEntity";

export interface ITicketRepository {
  findByTicketNumber(ticketNumber: string): Promise<TicketEntity | null>;
}
