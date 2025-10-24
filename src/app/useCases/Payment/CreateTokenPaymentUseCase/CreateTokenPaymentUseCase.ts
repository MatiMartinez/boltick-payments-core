import { v4 as uuid } from "uuid";
import { TokenPaymentEntity } from "@domain/entities/TokenPaymentEntity";
import { ITokenPaymentRepository } from "@domain/repositories/ITokenPaymentRepository";
import { CreateTokenPaymentInput, CreateTokenPaymentOutput } from "./interface";
import { IMercadoPagoService } from "@services/MercadoPago/interface";
import { ILogger } from "@commons/Logger/interface";

export class CreateTokenPaymentUseCase {
  private appUrl: string;

  constructor(
    private TokenPaymentRepository: ITokenPaymentRepository,
    private MercadoPagoService: IMercadoPagoService,
    private Logger: ILogger,
    appUrl: string
  ) {
    this.appUrl = appUrl;
  }

  async execute(input: CreateTokenPaymentInput): Promise<CreateTokenPaymentOutput> {
    const currentTime = new Date().getTime();

    const tokenPayment: TokenPaymentEntity = {
      ...input,
      id: uuid(),
      createdAt: currentTime,
      updatedAt: currentTime,
      paymentStatus: "Pending",
      tokensSent: "Pending",
      paymentDetails: {
        amount: input.amount,
        code: "",
        id: "",
        updatedAt: 0,
      },
    };

    await this.TokenPaymentRepository.createTokenPayment(tokenPayment);

    const link = await this.MercadoPagoService.generateLink({
      email: tokenPayment.userId,
      externalReference: tokenPayment.id,
      items: [
        {
          id: uuid(),
          title: `BOLT Tokens`,
          quantity: input.amount,
          unit_price: 1,
        },
      ],
      back_urls: {
        failure: `${this.appUrl}/tokens/error`,
        pending: `${this.appUrl}/tokens/processing`,
        success: `${this.appUrl}/tokens/success`,
      },
    });

    this.Logger.info(`[CreateTokenPaymentUseCase] Pago de tokens creado correctamente: ${link.url}`);

    return { success: 1, message: "Pago de tokens creado correctamente", data: { url: link.url } };
  }
}
