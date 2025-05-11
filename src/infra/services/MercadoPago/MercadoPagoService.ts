import { MercadoPagoConfig, Preference } from 'mercadopago';
import { v4 as uuid } from 'uuid';

import { GenerateLinkDTO } from './interface';

export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private appUrl: string;

  constructor(accessToken: string, appUrl: string) {
    if (!accessToken || !appUrl) {
      throw new Error('Missing required configurations for MercadoPagoService.');
    }

    this.client = new MercadoPagoConfig({ accessToken });
    this.appUrl = appUrl;
  }

  async generateLink(input: GenerateLinkDTO): Promise<string> {
    const preference = new Preference(this.client);

    const preferences = this.generatePreference(input);

    console.log('Generated preference:', JSON.stringify(preferences, null, 2));

    const response = await preference.create({ body: preferences });

    if (response.api_response.status !== 201 || !response?.init_point) {
      console.error('Error generating payment link.', JSON.stringify(response, null, 2));
      throw new Error('Error generating payment link.');
    }

    return response.init_point;
  }

  private generatePreference(input: GenerateLinkDTO) {
    const { email, external_reference, totalPrice } = input;

    return {
      back_urls: {
        failure: `${this.appUrl}/payment/error`,
        pending: `${this.appUrl}/payment/processing`,
        success: `${this.appUrl}/payment/success`,
      },
      auto_return: 'approved',
      external_reference: external_reference,
      items: [
        {
          id: uuid(),
          quantity: 1,
          title: 'Ticket',
          unit_price: totalPrice,
        },
      ],
      payer: { email: email },
    };
  }
}
