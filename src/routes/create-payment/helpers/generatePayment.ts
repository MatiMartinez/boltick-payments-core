import { PaymentEntity } from 'src/entities/payment.entity';
import { CreatePaymentPayload } from '../interface';

export const generatePayment = (payload: CreatePaymentPayload): PaymentEntity => {
  const prefixEvent = payload.event.slice(0, 2).toUpperCase();

  return {
    ...payload,
    callbackStatus: 'Pending',
    createdAt: new Date().getTime(),
    id: generateId(prefixEvent),
    provider: 'Mercado Pago',
    status: 'Pending',
  };
};

const generateId = (prefix: string): string => {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(100000 + Math.random() * 900000);

  return `${prefix}${letter}${numbers}`;
};
