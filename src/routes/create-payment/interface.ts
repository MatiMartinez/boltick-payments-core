import { PaymentEntity } from 'src/entities/payment.entity';

export type CreatePaymentPayload = Pick<PaymentEntity, 'event' | 'id' | 'items' | 'phone' | 'user'>;
