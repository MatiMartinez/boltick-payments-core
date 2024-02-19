import { v4 as uuid } from 'uuid';
import { PaymentEntity } from './payment.entity';
import { MercadopagoPreference } from '../infra/services/mercadopago/interface';

export class PaymentVO {
  create = (payload: CreatePaymentPayload): PaymentEntity => {
    return {
      ...payload,
      createdAt: new Date().getTime(),
      id: this.generateId('PS'),
      provider: 'Mercado Pago',
      items: payload.items,
      status: 'Pending',
    };
  };

  createMercadopagoPreference = (payload: PaymentEntity): MercadopagoPreference => {
    const { id, items, user } = payload;

    const APP_URL = process.env.APP_URL;

    const precio_total = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

    return {
      auto_return: 'approved',
      back_urls: {
        failure: `${APP_URL}/payment-callback-failure?external_reference=${id}`,
        pending: `${APP_URL}/payment-callback-pending?external_reference=${id}`,
        success: `${APP_URL}/payment-callback-success?external_reference=${id}`,
      },
      external_reference: id,
      items: [
        {
          id: uuid(),
          quantity: 1,
          title: `Orden ${id}`,
          unit_price: precio_total,
        },
      ],
      payer: {
        email: user,
      },
    };
  };

  private generateId = (prefix: string): string => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const numbers = Math.floor(100000 + Math.random() * 900000);

    return `${prefix}${letter}${numbers}`;
  };
}

export type CreatePaymentPayload = Omit<PaymentEntity, 'date' | 'id' | 'provider' | 'status' | 'used'>;
