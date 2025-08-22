import { v4 as uuid } from "uuid";
import { NFT, PaymentEntity } from "@domain/entities/PaymentEntity";
import { EventEntity } from "@domain/entities/EventEntity";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { CreatePaymentInput, CreatePaymentOutput, NFTInput } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { IMercadoPagoService } from "@services/MercadoPago/interface";
import { ILogger } from "@commons/Logger/interface";
import { ITicketCountRepository } from "@domain/repositories/ITicketCountRepository";

export class CreatePaymentUseCase {
  constructor(
    private PaymentRepository: IPaymentRepository,
    private TicketCountRepository: ITicketCountRepository,
    private EventRepository: IEventRepository,
    private MercadoPagoService: IMercadoPagoService,
    private Logger: ILogger
  ) {}

  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const event = await this.EventRepository.findById(input.eventId);
    if (!event) {
      throw new Error("Evento no encontrado");
    }

    this.validateNFTPrices(event, input.nfts);

    const isValid = await this.validateTicketCount(event, input.nfts);
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

  private async validateTicketCount(event: EventEntity, nfts: NFTInput[]): Promise<boolean> {
    const ticketCount = await this.TicketCountRepository.getCountByEventId(event.id);

    // Agrupar NFTs por tipo para obtener la cantidad total solicitada de cada tipo
    const groupByType = nfts.reduce(
      (acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.quantity;
        return acc;
      },
      {} as Record<string, number>
    );

    // Validar cada tipo de ticket solicitado
    for (const type in groupByType) {
      const requestedQuantity = groupByType[type];

      // Buscar la cantidad de tickets disponibles para el tipo de ticket
      const eventTicket = event.tickets.find((t) => t.name === type);
      if (!eventTicket) {
        this.Logger.error("[CreatePaymentUseCase] Tipo de ticket no encontrado en el evento", { type, event });
        return false;
      }

      // Obtener la cantidad actual vendida de este tipo
      const ticketCountType = ticketCount.count.find((t) => t.type === type);
      if (!ticketCountType) {
        this.Logger.error("[CreatePaymentUseCase] No se encontró el contador para el tipo de ticket", { type, eventId: event.id });
        return false;
      }
      const currentSoldCount = ticketCountType.count;

      // Verificar si hay suficientes tickets disponibles
      const totalAfterPurchase = currentSoldCount + requestedQuantity;
      if (totalAfterPurchase > eventTicket.availableTickets) {
        this.Logger.warn("[CreatePaymentUseCase] No hay suficientes tickets disponibles", {
          type,
          requestedQuantity,
          currentSoldCount,
          availableTickets: eventTicket.availableTickets,
          totalAfterPurchase,
        });
        return false;
      }
    }

    return true;
  }
}
