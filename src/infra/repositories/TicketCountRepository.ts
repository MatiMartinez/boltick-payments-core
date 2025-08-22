import { ILogger } from "@commons/Logger/interface";
import { TicketCountModel } from "@models/TicketCount";

export class TicketCountRepository {
  constructor(private logger: ILogger) {}

  async getCountByEventId(eventId: string) {
    try {
      return await TicketCountModel.get(eventId);
    } catch (error) {
      this.logger.error("[TicketCountRepository] Error al obtener el contador de tickets", {
        eventId,
        error: (error as Error).message,
      });
      throw error;
    }
  }
}
