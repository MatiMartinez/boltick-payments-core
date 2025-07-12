import { Status } from "@domain/Payment";

export interface UpdatePaymentInput {
  id: string;
  callbackStatus: Status;
}

export interface UpdatePaymentOutput {
  result: number;
  message: string;
}
