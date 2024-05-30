import { PaymentEntity } from '../../entities/payment.entity';

export type CreateFreePaymentPayload = Pick<PaymentEntity, 'event' | 'id' | 'items' | 'phone' | 'user'>;
