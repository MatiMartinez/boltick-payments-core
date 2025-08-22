import { TicketCountEntity } from "@domain/entities/TicketCountEntity";

export interface ITicketCountRepository {
  getCountByEventId(eventId: string): Promise<TicketCountEntity>;
}
