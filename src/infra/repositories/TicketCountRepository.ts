import { TicketCountModel } from "@models/TicketCount";

export class TicketCountRepository {
  async getCountByEventId(eventId: string): Promise<number> {
    const response = await TicketCountModel.get(eventId);
    if (!response) {
      throw new Error(
        `No se encontró el contador de tickets para el evento ${eventId}`
      );
    }
    return response.count;
  }
}
