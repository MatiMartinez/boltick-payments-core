import { MercadoPagoConfig, Preference } from "mercadopago";
import { IMercadoPagoService, GenerateLinkInput, GenerateLinkOutput, GeneratePreferenceInput, GeneratePreferenceOutput } from "./interface";
import { ILogger } from "@commons/Logger/interface";

export class MercadoPagoService implements IMercadoPagoService {
  private client: MercadoPagoConfig;
  private appUrl: string;
  private logger: ILogger;

  constructor(accessToken: string, appUrl: string, logger: ILogger) {
    if (!accessToken || !appUrl) {
      throw new Error("Missing required configurations for MercadoPagoService.");
    }
    this.client = new MercadoPagoConfig({ accessToken });
    this.appUrl = appUrl;
    this.logger = logger;
  }

  public async generateLink(input: GenerateLinkInput): Promise<GenerateLinkOutput> {
    const preference = new Preference(this.client);
    const preferences = this.generatePreference(input);

    this.logger.info("Generated MercadoPago preference", { preferences });

    try {
      const response = await preference.create({ body: preferences });
      if (response.api_response.status !== 201 || !response?.init_point) {
        this.logger.error("Error generating payment link", { response });
        throw new Error("Error generating payment link.");
      }
      this.logger.info("Payment link generated successfully", {
        url: response.init_point,
      });
      return { url: response.init_point };
    } catch (error) {
      this.logger.error("Exception thrown in MercadoPagoService.generateLink", {
        error,
      });
      throw error;
    }
  }

  private generatePreference(input: GeneratePreferenceInput): GeneratePreferenceOutput {
    const { email, externalReference, items } = input;
    return {
      back_urls: {
        failure: `${this.appUrl}/payment/error`,
        pending: `${this.appUrl}/payment/processing`,
        success: `${this.appUrl}/payment/success`,
      },
      auto_return: "approved",
      external_reference: externalReference,
      items,
      payer: { email: email },
    };
  }
}
