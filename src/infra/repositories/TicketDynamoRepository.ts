import { TicketModel } from "@models/TicketModel";
import { TicketEntity } from "@domain/entities/TicketEntity";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";

export class TicketDynamoRepository implements ITicketRepository {
  async findByTicketNumber(ticketNumber: string): Promise<TicketEntity | null> {
    try {
      const response = await TicketModel.query("ticketNumber").eq(ticketNumber).using("ticketNumberIndex").exec();
      return (response[0] as unknown as TicketEntity) || null;
    } catch (error) {
      return null;
    }
  }

  async update(ticket: TicketEntity): Promise<void> {
    const { walletAddress, createdAt, ...rest } = ticket;

    try {
      await TicketModel.update({ walletAddress, createdAt }, rest);
    } catch (error) {
      throw new Error(`Error updating ticket: ${error}`);
    }
  }
}
