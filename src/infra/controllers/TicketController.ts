import { Request, Response } from "express";

import { GetTicketsUseCase } from "@useCases/GetTicketsUseCase/GetTicketsUseCase";
import { IGenerateEntryUseCase } from "@useCases/GenerateEntryUseCase/interface";

export class TicketController {
  constructor(
    private GetTicketsUseCase: GetTicketsUseCase,
    private GenerateEntryUseCase: IGenerateEntryUseCase
  ) {}

  async GetTickets(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.params.id as string;
      const result = await this.GetTicketsUseCase.execute({ walletAddress });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error("Error getting tickets:", err.message);
      res.status(400).json({ error: err.message });
    }
  }

  async GenerateEntry(req: Request, res: Response): Promise<void> {
    try {
      const ticketNumber = req.body.ticketNumber as string;
      const result = await this.GenerateEntryUseCase.execute({ ticketNumber });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error("Error generating entry token:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
