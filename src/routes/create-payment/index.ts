import { savePaymentDB } from '../../repository/payment.dynamo';
import { generateMercadoPagoPaymentLink } from '../../services/mercadopago/mercadopago.service';
import { CreatePaymentPayload, generatePayment } from './helpers/generatePayment';

export const createPayment = async (payload: CreatePaymentPayload) => {
  const new_payment = generatePayment(payload);
  const payment = await savePaymentDB(new_payment);

  console.log('Payment saved in DynamoDB: ', JSON.stringify(payment, null, 2));

  const payment_link = await generateMercadoPagoPaymentLink(new_payment);
  return payment_link;
};
