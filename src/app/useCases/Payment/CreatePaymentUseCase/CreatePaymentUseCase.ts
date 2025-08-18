import { v4 as uuid } from "uuid";
import { NFT, PaymentEntity } from "@domain/entities/PaymentEntity";
import { EventEntity } from "@domain/entities/EventEntity";
import { PaymentRepository } from "@repositories/PaymentRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { CreatePaymentInput, CreatePaymentOutput, NFTInput } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { ILogger } from "@commons/Logger/interface";

export class CreatePaymentUseCase {
  constructor(
    private PaymentRepository: PaymentRepository,
    private TicketCountRepository: TicketCountRepository,
    private EventRepository: IEventRepository,
    private MercadoPagoService: MercadoPagoService,
    private Logger: ILogger
  ) {}

  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const event = await this.EventRepository.findById(input.eventId);
    if (!event) {
      throw new Error("Evento no encontrado");
    }

    this.validateNFTPrices(event, input.nfts);

    const isValid = await this.validateTicketCount(event);
    if (!isValid) {
      return { success: 0, message: "Lo sentimos, las entradas se agotaron" };
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

    const link = await this.MercadoPagoService.generateLink({
      email: payment.userId,
      externalReference: payment.id,
      items: input.nfts.map((nft) => ({
        id: uuid(),
        title: `${nft.collectionName} ${nft.type}`,
        quantity: nft.quantity,
        unit_price: nft.unitPrice,
      })),
    });

    return { success: 1, message: "Pago creado correctamente", data: { url: link.url } };
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

  private validateNFTPrices(event: EventEntity, nfts: NFTInput[]): void {
    for (const nft of nfts) {
      const officialTicket = event.tickets.find((t) => t.name === nft.type);

      if (!officialTicket) {
        this.Logger.error("[CreatePaymentUseCase] Ticket no encontrado para el type especificado", { type: nft.type });
        throw new Error("El tipo de ticket no es válido para este evento");
      }

      if (officialTicket.price !== nft.unitPrice) {
        this.Logger.warn("[CreatePaymentUseCase] Intento de compra con precio modificado", {
          ticket: officialTicket,
          recibido: nft,
        });
        throw new Error("El precio del ticket no coincide con el precio oficial");
      }
    }
  }

  private async validateTicketCount(event: EventEntity): Promise<boolean> {
    const soldTickets = await this.TicketCountRepository.getCountByEventId(event.id);

    if (soldTickets >= event.availableTickets) {
      return false;
    }

    return true;
  }
}
