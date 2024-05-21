import { PaymentEntity } from 'src/entities/payment.entity';

export type CreatePaymentPayload = Pick<PaymentEntity, 'items' | 'phone' | 'user'>;
