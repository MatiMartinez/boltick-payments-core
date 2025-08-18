import { Status } from "@domain/entities/PaymentEntity";

export interface UpdatePaymentInput {
  id: string;
  callbackStatus: Status;
}

export interface UpdatePaymentOutput {
  result: number;
  message: string;
}
