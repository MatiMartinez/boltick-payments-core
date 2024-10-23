import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuid } from 'uuid';

import { GeneratePaymentLinkPayload, GeneratePaymentLinkResponse } from './interface';
import { PaymentEntity } from '../../entities/payment.entity';

export const generateMercadoPagoPaymentLink = async (payload: PaymentEntity): Promise<GeneratePaymentLinkResponse> => {
  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string });
  const preference = new Preference(client);

  const preferences = generateMercadopagoPreference(payload);
  const response = await preference.create({ body: preferences });

  if (response.api_response.status !== 201 || !response?.init_point) {
    console.log('Error generating payment link.', JSON.stringify(response, null, 2));
    throw new Error('Error generating payment link.');
  }

  return { url: response.init_point };
};

const generateMercadopagoPreference = (payload: PaymentEntity): GeneratePaymentLinkPayload => {
  const { id, userId, nfts } = payload;

  const APP_URL = process.env.APP_URL;

  const precio_total = nfts.reduce((acc, item) => acc + item.unitPrice, 0);

  return {
    auto_return: 'approved',
    back_urls: {
      failure: `${APP_URL}/payment-callback-failure?external_reference=${id}&amount=${precio_total}`,
      pending: `${APP_URL}/payment-callback-pending?external_reference=${id}&amount=${precio_total}`,
      success: `${APP_URL}/payment-callback-success?external_reference=${id}&amount=${precio_total}`,
    },
    external_reference: id,
    items: [{ id: uuid(), quantity: 1, title: id, unit_price: precio_total }],
    payer: { email: userId },
  };
};
