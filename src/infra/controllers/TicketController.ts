import { Request, Response } from "express";

import { GetTicketsUseCase } from "@useCases/Ticket/GetTicketsUseCase/GetTicketsUseCase";
import { IGenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/interface";
import { IGetTicketsByWalletUseCase } from "@useCases/Ticket/GetTicketsByWalletUseCase.ts/interface";
import { ILogger } from "@commons/Logger/interface";

export class TicketController {
  constructor(
    private GetTicketsUseCase: GetTicketsUseCase,
    private GetTicketsByWalletUseCase: IGetTicketsByWalletUseCase,
    private GenerateEntryUseCase: IGenerateEntryUseCase,
    private Logger: ILogger
  ) {}

  async GetTickets(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.params.id as string;
      const result = await this.GetTicketsUseCase.execute({ walletAddress });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[TicketController] Error al obtener tickets:", err.message);
      res.status(400).json({ error: err.message });
    }
  }

  async GetTicketsByWallet(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.params.id as string;
      const result = await this.GetTicketsByWalletUseCase.execute({ walletAddress });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[TicketController] Error al obtener tickets:", err.message);
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
      this.Logger.error("[TicketController] Error al generar token de entrada:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
