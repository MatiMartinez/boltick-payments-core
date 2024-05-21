import { createPayment } from './routes/create-payment';
import { updatePayment } from './routes/update-payment';

export const handler = async (event: any, _context: any, callback: any) => {
  try {
    console.log('Evento: ', JSON.stringify(event, null, 2));

    const payload = JSON.parse(event.body);
    console.log('Ingresa el siguiente payload: ', JSON.stringify(payload, null, 2));

    if (event.requestContext.http.path === '/api/create-payment' && event.requestContext.http.method === 'POST') {
      const response = await createPayment(payload);
      if (!response) throw new Error('Error creating payment.');
      callback(null, { statusCode: 200, body: JSON.stringify(response) });
    }

    if (
      event.requestContext.http.path === '/api/update-payment-callback' &&
      event.requestContext.http.method === 'POST'
    ) {
      const response = await updatePayment(payload);
      if (!response) throw new Error('Error creating payment.');
      callback(null, { statusCode: 200, body: JSON.stringify(response) });
    }

    callback(null, { statusCode: 200, body: 'Ok' });
  } catch (error) {
    const err = error as Error;
    console.log('Ocurrio un error general: ', JSON.stringify(err, null, 2));

    callback(null, { statusCode: 400, body: JSON.stringify(err.message) });
  }
};
