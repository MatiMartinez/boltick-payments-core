import { Request, Response } from "express";
import { IGetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/interface";
import { IGetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/interface";

export class EventController {
  constructor(
    private GetEventByIdUseCase: IGetEventByIdUseCase,
    private GetAllEventsUseCase: IGetAllEventsUseCase
  ) {}

  async GetEventById(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id as string;
      const result = await this.GetEventByIdUseCase.execute({ eventId });

      if (!result.data) {
        res.status(404).json({ error: "Evento no encontrado" });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  async GetAllEvents(_req: Request, res: Response): Promise<void> {
    try {
      const result = await this.GetAllEventsUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }
}
