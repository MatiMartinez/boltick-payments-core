import { PaymentEntity } from '../../entities/payment.entity';

export type UpadatePaymentPayload = Pick<PaymentEntity, 'callbackStatus' | 'id'>;
