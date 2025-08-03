export interface IJWTService {
  generateAccessToken(payload: any, expiresIn: number): string;
}
