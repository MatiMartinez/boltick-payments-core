import { v4 as uuid } from 'uuid';

import { PaymentEntity } from '../../../entities/payment.entity';
import { CreateFreePaymentPayload } from '../interface';

export const generateFreePayment = (payload: CreateFreePaymentPayload): PaymentEntity => {
  return {
    ...payload,
    callbackStatus: 'Approved',
    createdAt: new Date().getTime(),
    payment: { amount: 0, code: '', id: uuid(), updatedAt: new Date().getTime() },
    provider: '',
    status: 'Approved',
  };
};
