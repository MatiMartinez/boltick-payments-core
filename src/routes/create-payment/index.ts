import { savePaymentDB } from '../../repository/payment.dynamo';
import { generatePaymentLink } from '../../services/mercadopago/mercadopago.service';
import { generatePayment } from './helpers/generatePayment';
import { CreatePaymentPayload } from './interface';

export const createPayment = async (payload: CreatePaymentPayload) => {
  const new_payment = generatePayment(payload);
  await savePaymentDB(new_payment);

  const payment_link = await generatePaymentLink(new_payment);
  return payment_link;
};
