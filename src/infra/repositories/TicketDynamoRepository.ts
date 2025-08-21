import { TicketModel } from "@models/TicketModel";
import { TicketEntity } from "@domain/entities/TicketEntity";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { ILogger } from "@commons/Logger/interface";

export class TicketDynamoRepository implements ITicketRepository {
  constructor(private Logger: ILogger) {}

  async findByTicketNumber(ticketNumber: string): Promise<TicketEntity | null> {
    try {
      const response = await TicketModel.query("ticketNumber").eq(ticketNumber).using("ticketNumberIndex").exec();
      return (response[0] as unknown as TicketEntity) || null;
    } catch (error) {
      const err = error as Error;
      this.Logger.error(`[TicketDynamoRepository] Error al buscar ticket: ${err.message}`);
      return null;
    }
  }

  async findByWalletAddress(walletAddress: string): Promise<TicketEntity[]> {
    try {
      const response = await TicketModel.query("walletAddress").eq(walletAddress).exec();
      return (response as unknown as TicketEntity[]) || [];
    } catch (error) {
      const err = error as Error;
      this.Logger.error(`[TicketDynamoRepository] Error al buscar tickets: ${err.message}`);
      throw error;
    }
  }

  async update(ticket: TicketEntity): Promise<void> {
    const { walletAddress, createdAt, ...rest } = ticket;

    try {
      await TicketModel.update({ walletAddress, createdAt }, rest);
    } catch (error) {
      const err = error as Error;
      this.Logger.error(`[TicketDynamoRepository] Error al actualizar ticket: ${err.message}`);
      throw error;
    }
  }
}
