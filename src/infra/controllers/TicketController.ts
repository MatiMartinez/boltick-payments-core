import { Request, Response } from 'express';

import { GetTicketsUseCase } from '@useCases/GetTickets';

export class TicketController {
  constructor(private GetTicketsUseCase: GetTicketsUseCase) {}

  async GetTickets(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;

      const result = await this.GetTicketsUseCase.execute(id);
      res.status(200).json({ tokens: result });
    } catch (error) {
      const err = error as Error;
      console.error('Error obtaining tokens:', err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
