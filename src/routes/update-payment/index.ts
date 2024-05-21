import { getPaymentDB, updatePaymentCallbackStatus } from '../../repository/payment.dynamo';
import { UpadatePaymentPayload } from './interface';

export const updatePayment = async (payload: UpadatePaymentPayload) => {
  const { callbackStatus, id } = payload;

  const currentPayment = await getPaymentDB(id);
  if (currentPayment.callbackStatus === 'Approved') return true;

  await updatePaymentCallbackStatus(id, callbackStatus);
  // Must send the payment notification.
  return true;
};
