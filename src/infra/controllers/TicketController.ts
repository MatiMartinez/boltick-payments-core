import { Request, Response } from "express";

import { GetTicketsUseCase } from "@useCases/GetTicketsUseCase/GetTicketsUseCase";

export class TicketController {
  constructor(private GetTicketsUseCase: GetTicketsUseCase) {}

  async GetTickets(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.params.id as string;
      const result = await this.GetTicketsUseCase.execute({ walletAddress });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error("Error obtaining tickets:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
