import { Request, Response } from "express";

import { IGetTokenBalanceUseCase } from "@useCases/Token/GetTokenBalanceUseCase/interface";
import { ILogger } from "@commons/Logger/interface";

export class TokenController {
  constructor(
    private GetTokenBalanceUseCase: IGetTokenBalanceUseCase,
    private Logger: ILogger
  ) {}

  async GetTokenBalance(req: Request, res: Response): Promise<void> {
    try {
      const walletAddress = req.params.walletAddress as string;
      const result = await this.GetTokenBalanceUseCase.execute({ walletAddress });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[TokenController] Error al obtener el balance del token:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
}
