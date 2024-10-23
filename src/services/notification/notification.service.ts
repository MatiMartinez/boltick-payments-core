import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { PaymentEntity } from '../../entities/payment.entity';

export const notifyFreeTickets = async (_payload: PaymentEntity) => {
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
                  <img src="https://boltick-public-assets.s3.amazonaws.com/boltick-negro.png" style="width: 150px" />
                </div>

                <br />
                
                <div style="padding-left: 16px">
                  <h2>¡Gracias por unirte a ${event} junto a Boltick!</h2>
                </div>
                
                <div style="padding-left: 16px">
                  <p style="font-size: 16px">¡Hola! Hemos recibido correctamente tu solicitud de entradas. Te informamos que el día 13 de junio recibirás las entradas en este mismo correo electrónico.</p>
                  <p style="font-size: 16px">¡Muchas gracias por tu participación!</p>
                </div>

                <div style="padding-left: 16px">
                  <div style="padding: 16px; border-radius: 4px; border: 1px solid #cecece">
                      <p style="margin: 0; font-size: 20px; font-weight: 600;"></p>
                      <p style="margin: 0; font-size: 14px;">Centro de Congreso Francisco, Parque Agnesi, San Martín, Mendoza.</p>
                      <a href="https://maps.app.goo.gl/ZwkeRuEQ56XoFSHo8" target="_blank" style="margin: 0; font-size: 16px">Ver ubicación</a>
                  </div>
                </div>

                <br />

                <div style="padding-left: 16px">
                  <p style="font-size: 16px; font-weight: 700">El equipo de Boltick</p>
                </div>        
    
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
      Destination: { ToAddresses: [''] },
      Message: { Body: { Html: { Data: templateHtml } }, Subject: { Data: 'Tus entradas - Boltick' } },
      Source: 'contacto@boltick.com.ar',
    })
  );
};
