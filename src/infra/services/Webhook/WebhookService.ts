import axios, { AxiosInstance } from "axios";
import { IWebhookService } from "./interface";
import { ILogger } from "@commons/Logger/interface";

export class WebhookService implements IWebhookService {
  private axios: AxiosInstance;
  private logger: ILogger;

  constructor(env: "QA" | "PROD", logger: ILogger) {
    this.logger = logger;
    this.axios = axios.create({
      baseURL: env === "QA" ? "https://a4bh96mp3a.execute-api.us-east-1.amazonaws.com/api" : "",
    });
  }

  public async updateFreePayment(id: string): Promise<boolean> {
    try {
      const response = await this.axios.post<{ success: boolean }>("/update-free-payment", { id });
      return response.data.success;
    } catch (error) {
      const err = error as Error;
      this.logger.error("[WebhookService] Error al actualizar el pago gratuito", { error: err.message });
      throw new Error(err.message);
    }
  }
}
