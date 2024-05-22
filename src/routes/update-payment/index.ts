import { getPaymentDB, updatePaymentCallbackStatusDB } from '../../repository/payment.dynamo';
import { UpadatePaymentPayload } from './interface';

export const updatePayment = async (payload: UpadatePaymentPayload) => {
  const { callbackStatus, id } = payload;

  const currentPayment = await getPaymentDB(id);
  if (currentPayment.callbackStatus === 'Approved') return true;

  await updatePaymentCallbackStatusDB(id, callbackStatus);
  return true;
};
