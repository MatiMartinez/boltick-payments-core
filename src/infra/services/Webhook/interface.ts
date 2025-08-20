export interface IWebhookService {
  updateFreePayment(id: string): Promise<boolean>;
}
