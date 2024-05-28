import { PaymentEntity } from 'src/entities/payment.entity';
import { CreatePaymentPayload } from '../interface';

export const generatePayment = (payload: CreatePaymentPayload): PaymentEntity => {
  return {
    ...payload,
    callbackStatus: 'Pending',
    createdAt: new Date().getTime(),
    provider: 'Mercado Pago',
    status: 'Pending',
  };
};
