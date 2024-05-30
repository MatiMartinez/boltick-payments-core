import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { PaymentEntity } from '../../entities/payment.entity';

export const notifyFreeTickets = async (payload: PaymentEntity) => {
  const { user } = payload;

  const sesClient = new SESClient({ region: 'us-east-1' });

  const templateHtml = `
    <html>
      <head>
        <title></title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" />
      </head>
      <body style="font-family: 'Poppins', sans-serif">
        <table width="100%">
          <tr>
            <td align="center" style="border: none; padding: 0">
              <div style="max-width: 500px; text-align: start">
                <div style="padding-block: 24px; padding-left: 16px">
                  <img src="https://boltick-public-assets.s3.amazonaws.com/boltick.svg" />
                </div>

                <br />
                
                <div style="padding-left: 16px">
                  <h3>¡Gracias por unirte a ${payload.event} junto a Boltick!</h3>
                </div>
                
                <div style="padding-left: 16px">
                  <p>¡Hola! <br />
                  Hemos recibido correctamente tu solicitud de entradas. <br />
                  Te informamos que el día 13 de junio recibirás las entradas en este mismo correo electrónico.</p>
                  <p>¡Muchas gracias por tu participación!</p>
                </div>

                <div style="padding-left: 16px">
                  <p style="font-weight: 700">El equipo de Boltick</p>
                </div>        
    
                <br />

                <div style="padding-block: 12px; padding-left: 16px">
                  <p align="center" style="margin: 0; font-size: 14px">
                    &copy; 2024 Boltick. Todos los derechos reservados.
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </table>
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
