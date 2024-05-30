import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { PaymentEntity } from '../../entities/payment.entity';

export const notifyFreeTickets = async (payload: PaymentEntity) => {
  const { user } = payload;

  const sesClient = new SESClient({ region: 'us-east-1' });

  const templateHtml = `
    <html>
      <head>
        <title>Confirmación de Ticket</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" />
      </head>
      <body style="font-family: 'Poppins', sans-serif">
        <h1>¡Botón!</h1>
      </body>
    </html>`;

  await sesClient.send(
    new SendEmailCommand({
      Destination: { ToAddresses: [user] },
      Message: { Body: { Html: { Data: templateHtml } }, Subject: { Data: 'Tus entradas - Boltick' } },
      Source: 'contacto@boltick.com.ar',
    })
  );
};
