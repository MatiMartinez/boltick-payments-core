import { Ticket } from '@domain/Ticket';

export interface GetTicketsInput {
  userId: string;
}

export interface GetTicketsOutput {
  tickets: Ticket[];
}
