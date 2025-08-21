import { TicketEntity } from "@domain/entities/TicketEntity";
import { GetTicketsByWalletInput, IGetTicketsByWalletUseCase, UserTicket } from "./interface";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";

export class GetTicketsByWalletUseCase implements IGetTicketsByWalletUseCase {
  constructor(private TicketRepository: ITicketRepository) {}

  async execute(input: GetTicketsByWalletInput) {
    const tickets = await this.TicketRepository.findByWalletAddress(input.walletAddress);

    const mappedTickets: UserTicket[] = tickets.map((ticket) => this.mapToTicket(ticket));

    return { success: 1, message: "Tickets obtenidos correctamente", data: mappedTickets };
  }

  private mapToTicket(ticket: TicketEntity): UserTicket {
    return {
      ticketNumber: ticket.ticketNumber,
      type: ticket.type,
      unitPrice: ticket.unitPrice,
      imageUrl: ticket.imageUrl,

      eventId: ticket.eventId,
      eventName: ticket.eventName,
      prName: ticket.prName,

      assetId: ticket.assetId,
      collectionName: ticket.collectionName,
      collectionSymbol: ticket.collectionSymbol,

      createdAt: ticket.createdAt,
      used: ticket.used,
      useDate: ticket.useDate,
    };
  }
}
