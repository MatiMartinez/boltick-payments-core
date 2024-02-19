import { MercadoPagoConfig, Preference } from 'mercadopago';

import { MercadopagoPreference, IMercadoPagoService } from './interface';

export class MercadoPagoService implements IMercadoPagoService {
  private client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
  });
  private preference = new Preference(this.client);

  createPayment = async (payload: MercadopagoPreference) => {
    const response = await this.preference.create({
      body: payload,
    });

    if (response.api_response.status !== 201 || !response?.init_point) {
      console.log('Error al generar link de pago.', response);
      throw new Error();
    }

    return {
      url: response.init_point,
    };
  };
}
