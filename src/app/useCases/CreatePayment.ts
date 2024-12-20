import { v4 as uuid } from 'uuid';

import { NFT, Payment } from '@domain/Payment';
import { CreatePaymentDTO, NFTDTO } from '@dtos/CreatePayment';
import { PaymentRepository } from '@repositories/PaymentRepository';
import { MercadoPagoService } from '@services/MercadoPago/MercadoPagoService';

export class CreatePaymentUseCase {
  constructor(
    private PaymentRepository: PaymentRepository,
    private MercadoPagoService: MercadoPagoService
  ) {}

  async execute(input: CreatePaymentDTO): Promise<string> {
    const currentTime = new Date().getTime();

    const payment: Payment = {
      ...input,
      id: uuid(),
      createdAt: currentTime,
      updatedAt: currentTime,
      nfts: this.generateNFTs(input.nfts),
      callbackStatus: 'Pending',
      paymentStatus: 'Pending',
    };

    await this.PaymentRepository.createPayment(payment);

    const totalPrice = payment.nfts.reduce((acc, el) => acc + el.unitPrice, 0);

    const link = await this.MercadoPagoService.generateLink({
      email: payment.userId,
      external_reference: payment.id,
      totalPrice: totalPrice,
    });

    return link;
  }

  private generateNFTs(input: NFTDTO[]): NFT[] {
    const generatedNFTs: NFT[] = [];

    input.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const newNFT: NFT = {
          collectionName: item.collectionName,
          collectionSymbol: item.collectionSymbol,
          mint: '',
          mintDate: 0,
          transaccionId: '',
          type: item.type,
          unitPrice: item.unitPrice,
        };

        generatedNFTs.push(newNFT);
      }
    });

    return generatedNFTs;
  }
}
