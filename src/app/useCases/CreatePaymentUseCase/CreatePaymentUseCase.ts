import { v4 as uuid } from "uuid";
import { NFT, PaymentEntity } from "@domain/entities/PaymentEntity";
import { PaymentRepository } from "@repositories/PaymentRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { CreatePaymentInput, CreatePaymentOutput, NFTInput } from "./interface";
import { events } from "@db/events";

export class CreatePaymentUseCase {
  constructor(
    private PaymentRepository: PaymentRepository,
    private TicketCountRepository: TicketCountRepository,
    private MercadoPagoService: MercadoPagoService
  ) {}

  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    this.validateNFTPrices(input.eventId, input.nfts);

    const isValid = await this.validateTicketCount(input.eventId);
    if (!isValid) {
      return {
        success: 0,
        message: "Lo sentimos, las entradas se agotaron",
      };
    }

    const currentTime = new Date().getTime();

    const payment: PaymentEntity = {
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

    return {
      success: 1,
      message: "Pago creado correctamente",
      data: { url: link.url },
    };
  }

  private generateNFTs(input: NFTInput[]): NFT[] {
    const generatedNFTs: NFT[] = [];

    input.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        const newNFT: NFT = {
          id: uuid(),
          collectionName: item.collectionName,
          collectionSymbol: item.collectionSymbol,
          imageUrl: item.imageUrl,
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

  private validateNFTPrices(eventId: string, nfts: NFTInput[]): void {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      console.error("Evento no encontrado", { eventId });
      throw new Error("Evento no encontrado");
    }

    for (const nft of nfts) {
      const officialTicket = event.tickets.find((t) => t.name === nft.type);

      if (!officialTicket) {
        console.error("Ticket no encontrado para el type especificado", {
          type: nft.type,
        });
        throw new Error("El tipo de ticket no es válido para este evento");
      }

      if (officialTicket.price !== nft.unitPrice) {
        console.warn("Intento de compra con precio modificado", {
          ticket: officialTicket,
          recibido: nft.unitPrice,
        });
        throw new Error("El precio del ticket no coincide con el precio oficial");
      }
    }
  }

  private async validateTicketCount(eventId: string): Promise<boolean> {
    const count = await this.TicketCountRepository.getCountByEventId(eventId);
    if (count >= 200) {
      return false;
    }
    return true;
  }
}
