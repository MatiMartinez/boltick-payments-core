import { v4 as uuid } from "uuid";

import { NFT, Payment } from "@domain/Payment";
import { PaymentRepository } from "@repositories/PaymentRepository";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { CreatePaymentInput, CreatePaymentOutput, NFTInput } from "./interface";

export class CreatePaymentUseCase {
  constructor(
    private PaymentRepository: PaymentRepository,
    private MercadoPagoService: MercadoPagoService
  ) {}

  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const currentTime = new Date().getTime();

    const payment: Payment = {
      ...input,
      id: uuid(),
      createdAt: currentTime,
      updatedAt: currentTime,
      nfts: this.generateNFTs(input.nfts),
      callbackStatus: "Pending",
      paymentStatus: "Pending",
    };

    await this.PaymentRepository.createPayment(payment);

    const items = input.nfts.map((nft) => ({
      id: uuid(),
      title: `${nft.collectionName} ${nft.type}`,
      quantity: nft.quantity,
      unitPrice: nft.unitPrice,
    }));

    const link = await this.MercadoPagoService.generateLink({
      email: payment.userId,
      externalReference: payment.id,
      items,
    });

    return { url: link.url };
  }

  private generateNFTs(input: NFTInput[]): NFT[] {
    const generatedNFTs: NFT[] = [];

    input.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const newNFT: NFT = {
          id: uuid(),
          collectionName: item.collectionName,
          collectionSymbol: item.collectionSymbol,
          metadataUrl: "",
          mint: "",
          mintDate: 0,
          ticketNumber: "",
          transactionId: "",
          type: item.type,
          unitPrice: item.unitPrice,
        };

        generatedNFTs.push(newNFT);
      }
    });

    return generatedNFTs;
  }
}
