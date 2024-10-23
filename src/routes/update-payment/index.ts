import { PaymentEntity } from '../../entities/payment.entity';
import { getPaymentDB, updatePaymentCallbackStatusDB } from '../../repository/payment.dynamo';

export const updatePayment = async (payload: UpadatePaymentPayload) => {
  const { id, callbackStatus } = payload;

  const currentPayment = await getPaymentDB(id);
  if (currentPayment.callbackStatus === 'Approved') return true;

  const updatedPayment = await updatePaymentCallbackStatusDB(
    currentPayment.userId,
    currentPayment.createdAt,
    callbackStatus
  );

  console.log('Payment saved in DynamoDB: ', JSON.stringify(updatedPayment, null, 2));

  return true;
};

export type UpadatePaymentPayload = Pick<PaymentEntity, 'id' | 'callbackStatus'>;
