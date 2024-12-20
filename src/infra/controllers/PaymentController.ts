import { Request, Response } from 'express';

import { CreatePaymentUseCase } from '@useCases/CreatePayment';
import { UpdatePaymentUseCase } from '@useCases/UpdatePayment';

export class PaymentController {
  constructor(
    private CreatePaymentUseCase: CreatePaymentUseCase,
    private UpdatePaymentUseCase: UpdatePaymentUseCase
  ) {}

  async CreatePayment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.CreatePaymentUseCase.execute(req.body);
      res.status(200).json({ url: result });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating payment link:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  async UpdatePayment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.UpdatePaymentUseCase.execute(req.body);
      res.status(200).json({ payment: result });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating payment callback status:', err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
