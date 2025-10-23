import { Request, Response } from "express";

import { CreateTokenPaymentUseCase } from "@useCases/Payment/CreateTokenPaymentUseCase/CreateTokenPaymentUseCase";
import { ILogger } from "@commons/Logger/interface";

export class TokenPaymentController {
  constructor(
    private CreateTokenPaymentUseCase: CreateTokenPaymentUseCase,
    private Logger: ILogger
  ) {}

  async CreateTokenPayment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.CreateTokenPaymentUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[TokenPaymentController] Error creating token payment:", { error: err.message });
      res.status(400).json({ error: err.message });
    }
  }
}
