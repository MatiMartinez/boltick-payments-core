import * as jwt from "jsonwebtoken";

import { IJWTService } from "./interface";

export class JWTService implements IJWTService {
  private readonly secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  generateAccessToken(payload: any, expiresIn: number): string {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }
}
