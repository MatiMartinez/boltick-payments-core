import { Request, Response, NextFunction } from "express";
import * as jose from "jose";

const JWKS = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks"));

export const web3AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer ")) {
      res.status(401).json({ error: "No tienes permisos para acceder a este recurso" });
      return;
    }

    const idToken = authToken.split(" ")[1];
    if (!idToken) {
      res.status(401).json({ error: "No tienes permisos para acceder a este recurso" });
      return;
    }

    const payload = await jose.jwtVerify(idToken, JWKS, {
      algorithms: ["RS256"],
      issuer: "https://api-auth.web3auth.io",
      audience: process.env.WEB3AUTH_CLIENT_ID,
      clockTolerance: 60,
    });

    next();
  } catch (error) {
    console.error("Web3Auth token validation error:", error);
    res.status(401).json({
      error: "No tienes permisos para acceder a este recurso",
    });
    return;
  }
};
