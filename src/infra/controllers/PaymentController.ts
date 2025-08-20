import { Request, Response } from "express";

import { CreatePaymentUseCase } from "@useCases/Payment/CreatePaymentUseCase/CreatePaymentUseCase";
import { UpdatePaymentUseCase } from "@useCases/Payment/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { CreateFreePaymentUseCase } from "@useCases/Payment/CreateFreePaymentUseCase/CreateFreePaymentUseCase";
import { ILogger } from "@commons/Logger/interface";

export class PaymentController {
  constructor(
    private CreatePaymentUseCase: CreatePaymentUseCase,
    private UpdatePaymentUseCase: UpdatePaymentUseCase,
    private CreateFreePaymentUseCase: CreateFreePaymentUseCase,
    private Logger: ILogger
  ) {}

  async CreatePayment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.CreatePaymentUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[PaymentController] Error generating payment link:", { error: err.message });
      res.status(400).json({ error: err.message });
    }
  }

  async UpdatePayment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.UpdatePaymentUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[PaymentController] Error updating payment callback status:", { error: err.message });
      res.status(400).json({ error: err.message });
    }
  }

  async CreateFreePayment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.CreateFreePaymentUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[PaymentController] Error creating free payment:", { error: err.message });
      res.status(400).json({ error: err.message });
    }
  }
}
