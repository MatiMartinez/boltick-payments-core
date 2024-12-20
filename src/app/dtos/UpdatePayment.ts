import { Payment } from '@domain/Payment';

export type UpdatePaymentDTO = Pick<Payment, 'id' | 'callbackStatus'>;
