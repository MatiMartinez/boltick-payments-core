import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserEntity } from "@domain/entities/UserEntity";
import { RegisterUserInput, RegisterUserOutput } from "./interface";
import { ILogger } from "@commons/Logger/interface";
import * as jose from "jose";
import { uniqueNamesGenerator, adjectives, animals, colors, names } from "unique-names-generator";

const JWKS = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks"));

export class RegisterUserUseCase {
  constructor(
    private UserRepository: IUserRepository,
    private Logger: ILogger
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    try {
      // Decodificar el authToken para obtener email y walletAddress
      const decodedToken = await this.decodeAuthToken(input.authToken);
      const { email, walletAddress } = decodedToken;

      // Verificar si el usuario ya existe exactamente con email Y walletAddress
      const existingUser = await this.UserRepository.getUserByEmailAndWallet(email, walletAddress);

      if (existingUser) {
        this.Logger.info("[RegisterUserUseCase] Usuario ya existe", { email, walletAddress });
        return { success: 1, message: "Usuario ya existe" };
      }

      // Crear nuevo usuario con walletAlias único
      const walletAlias = await this.generateUniqueWalletAlias(walletAddress);
      const now = Date.now();
      const newUser: UserEntity = {
        email,
        walletAddress,
        walletAlias,
        createdAt: now,
        updatedAt: now,
      };

      await this.UserRepository.createUser(newUser);

      this.Logger.info("[RegisterUserUseCase] Usuario creado exitosamente", {
        email: newUser.email,
        walletAddress: newUser.walletAddress,
      });

      return { success: 1, message: "Usuario creado exitosamente" };
    } catch (error) {
      this.Logger.error("[RegisterUserUseCase] Error al procesar registro de usuario", {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  private async decodeAuthToken(authToken: string): Promise<{ email: string; walletAddress: string }> {
    try {
      // Remover "Bearer " si está presente
      const token = authToken.startsWith("Bearer ") ? authToken.slice(7) : authToken;

      const payload = await jose.jwtVerify(token, JWKS, {
        algorithms: ["RS256", "ES256", "PS256"],
        issuer: "https://api-auth.web3auth.io",
        audience: process.env.WEB3AUTH_CLIENT_ID,
        clockTolerance: 60,
      });

      const jwtPayload = payload.payload as any;

      if (!jwtPayload.email || !jwtPayload.wallets) {
        throw new Error("Token no contiene información requerida (email o walletAddress)");
      }

      // Extraer la primera walletAddress (asumiendo que es la principal)
      const walletAddress = jwtPayload.wallets[0]?.public_key || jwtPayload.wallets[0]?.address;

      if (!walletAddress) {
        throw new Error("No se pudo extraer la información de la walletAddress del token");
      }

      return {
        email: jwtPayload.email,
        walletAddress: walletAddress,
      };
    } catch (error) {
      this.Logger.error("[RegisterUserUseCase] Error al decodificar authToken", {
        error: (error as Error).message,
      });
      throw new Error("Token de autenticación inválido");
    }
  }

  private async generateUniqueWalletAlias(walletAddress: string): Promise<string> {
    // Usar la wallet como semilla para generar alias determinístico
    const seed = walletAddress.slice(-8);
    const seedNumber = parseInt(seed, 36) || Date.now();

    // Configuración para generar alias con unique-names-generator
    const config = {
      dictionaries: [adjectives, animals], // Combina adjetivos con animales
      separator: ".",
      length: 2,
      seed: seedNumber, // Usa la wallet como semilla para reproducibilidad
    };

    let baseAlias = uniqueNamesGenerator(config);

    // Verificar si el alias ya existe y agregar sufijo numérico si es necesario
    let finalAlias = baseAlias;
    let counter = 1;

    while (await this.UserRepository.checkWalletAliasExists(finalAlias)) {
      finalAlias = `${baseAlias}${counter}`;
      counter++;
    }

    return finalAlias;
  }
}
