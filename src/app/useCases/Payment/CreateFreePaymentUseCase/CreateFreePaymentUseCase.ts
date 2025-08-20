import { v4 as uuid } from "uuid";
import { NFT, PaymentEntity } from "@domain/entities/PaymentEntity";
import { EventEntity } from "@domain/entities/EventEntity";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { CreateFreePaymentInput, CreateFreePaymentOutput, NFTInput, ICreateFreePaymentUseCase } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { IWebhookService } from "@services/Webhook/interface";
import { ILogger } from "@commons/Logger/interface";

export class CreateFreePaymentUseCase implements ICreateFreePaymentUseCase {
  constructor(
    private PaymentRepository: IPaymentRepository,
    private TicketCountRepository: TicketCountRepository,
    private EventRepository: IEventRepository,
    private WebhookService: IWebhookService,
    private Logger: ILogger
  ) {}

  async execute(input: CreateFreePaymentInput): Promise<CreateFreePaymentOutput> {
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
      callbackStatus: "Approved",
      paymentStatus: "Pending",
      provider: "Gratuito",
    };

    await this.PaymentRepository.createPayment(payment);

    const success = await this.WebhookService.updateFreePayment(payment.id);
    if (!success) {
      this.Logger.error("[CreateFreePaymentUseCase] Error al actualizar el pago gratuito", { id: payment.id });
      return { success: 0, message: "Ocurrio un error al solicitar tus entradas" };
    }

    this.Logger.info("[CreateFreePaymentUseCase] Pago gratuito creado exitosamente", JSON.stringify(payment, null, 2));

    return { success: 1, message: "Pago gratuito creado correctamente", data: { id: payment.id } };
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
        this.Logger.error("[CreateFreePaymentUseCase] Ticket no encontrado para el type especificado", { type: nft.type });
        throw new Error("El tipo de ticket no es válido para este evento");
      }

      if (officialTicket.price !== nft.unitPrice) {
        this.Logger.warn("[CreateFreePaymentUseCase] Intento de compra con precio modificado", {
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
