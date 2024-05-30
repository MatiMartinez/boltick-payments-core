import { notifyFreeTickets } from '../../services/notification/notification.service';
import { savePaymentDB } from '../../repository/payment.dynamo';
import { generateFreePayment } from './helpers/generateFreeEvent';
import { CreateFreePaymentPayload } from './interface';

export const createFreePayment = async (payload: CreateFreePaymentPayload) => {
  const new_payment = generateFreePayment(payload);
  await savePaymentDB(new_payment);
  await notifyFreeTickets(new_payment);
  return true;
};
