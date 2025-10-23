import { Request, Response } from "express";
import { RegisterUserUseCase } from "@useCases/User/RegisterUserUseCase/RegisterUserUseCase";
import { ILogger } from "@commons/Logger/interface";

export class UserController {
  constructor(
    private RegisterUserUseCase: RegisterUserUseCase,
    private Logger: ILogger
  ) {}

  async RegisterUser(req: Request, res: Response): Promise<void> {
    try {
      const authToken = req.headers.authorization;

      if (!authToken) {
        res.status(400).json({ error: "Token de autorización requerido" });
        return;
      }

      const result = await this.RegisterUserUseCase.execute({ authToken });
      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      this.Logger.error("[UserController] Error registering user:", { error: err.message });
      res.status(400).json({ error: err.message });
    }
  }
}

