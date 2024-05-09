import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { PaymentVO } from './domain/payment.vo';
import { MercadoPagoService } from './infra/services/mercadopago/mercadopago.service';
import { PaymentDynamoRepository } from './infra/repository/payment.dynamo.repository';

export const handler = async (event: any, _context: any, callback: any) => {
  try {
    if (event?.requestContext?.http?.method === 'OPTIONS') {
      console.log('Metodo OPTIONS ');

      callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: null,
      });
      return;
    }

    const payload = event.detail;

    console.log('Ingresa el siguiente payload: ', JSON.stringify(payload, null, 2));

    const dynamoClient = new DynamoDBClient({
      region: 'us-east-1',
    });

    const new_payment = new PaymentVO().create(payload);
    const paymentRepository = new PaymentDynamoRepository(dynamoClient);
    const new_payment_db = await paymentRepository.createPayment(new_payment);

    console.log('Se creo el siguiente pago en DynamoDB: ', JSON.stringify(new_payment_db, null, 2));

    if (!new_payment_db) throw new Error('Error saving payment in DB.');

    const mercadopago_preference = new PaymentVO().createMercadopagoPreference(new_payment);
    const mercadoPagoService = new MercadoPagoService();
    const preference_response = await mercadoPagoService.createPayment(mercadopago_preference);

    console.log('Se creo el siguiente link de Mercadopago: ', JSON.stringify(preference_response, null, 2));

    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(preference_response),
    });
  } catch (error) {
    console.log('Ocurrio un error general: ', JSON.stringify(error, null, 2));

    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify(error),
    });
  }
};
