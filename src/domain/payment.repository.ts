import { PaymentEntity } from './payment.entity';

export interface PaymentRepository {
  createPayment: (payload: PaymentEntity) => Promise<PaymentEntity>;
}
