import { ILogger } from "@commons/Logger/interface";
import { Logger } from "@commons/Logger/Logger";

import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { S3Service } from "@services/S3/S3Service";
import { SolanaService } from "@services/Solana/SolanaService";
import { PaymentRepository } from "@repositories/PaymentRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { TicketDynamoRepository } from "@repositories/TicketDynamoRepository";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { EventDynamoRepository } from "@repositories/EventDynamoRepository";

import { CreatePaymentUseCase } from "@useCases/Payment/CreatePaymentUseCase/CreatePaymentUseCase";
import { UpdatePaymentUseCase } from "@useCases/Payment/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { GetTicketsUseCase } from "@useCases/Ticket/GetTicketsUseCase/GetTicketsUseCase";
import { IGenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/interface";
import { GenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/GenerateEntryUseCase";
import { IGetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/interface";
import { GetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/GetEventByIdUseCase";
import { IGetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/interface";
import { GetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/GetAllEventsUseCase";

import { PaymentController } from "@controllers/PaymentController";
import { TicketController } from "@controllers/TicketController";
import { EventController } from "@controllers/EventController";

export class Container {
  private static instance: Container;

  private logger: ILogger;
  private MercadoPagoService: MercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: SolanaService;

  private PaymentRepository: PaymentRepository;
  private TicketCountRepository: TicketCountRepository;
  private TicketRepository: ITicketRepository;
  private EventRepository: IEventRepository;

  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private GetTicketsUseCase: GetTicketsUseCase;
  private GenerateEntryUseCase: IGenerateEntryUseCase;
  private GetEventByIdUseCase: IGetEventByIdUseCase;
  private GetAllEventsUseCase: IGetAllEventsUseCase;

  private PaymentController: PaymentController;
  private TicketController: TicketController;
  private EventController: EventController;

  private constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN as string;
    const appUrl = process.env.APP_URL as string;
    const apiKey = process.env.SOLANA_API_KEY as string;

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    if (!appUrl) {
      throw new Error("APP_URL environment variable is required");
    }
    if (!apiKey) {
      throw new Error("SOLANA_API_KEY environment variable is required");
    }

    this.logger = Logger.getInstance();

    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl, this.logger);
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(apiKey);

    this.PaymentRepository = new PaymentRepository();
    this.TicketCountRepository = new TicketCountRepository();
    this.TicketRepository = new TicketDynamoRepository();
    this.EventRepository = new EventDynamoRepository(this.logger);

    this.CreatePaymentUseCase = new CreatePaymentUseCase(this.PaymentRepository, this.TicketCountRepository, this.MercadoPagoService);
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);
    this.GetTicketsUseCase = new GetTicketsUseCase(this.S3Service, this.SolanaService);
    this.GenerateEntryUseCase = new GenerateEntryUseCase(this.TicketRepository, this.logger);
    this.GetEventByIdUseCase = new GetEventByIdUseCase(this.EventRepository);
    this.GetAllEventsUseCase = new GetAllEventsUseCase(this.EventRepository);

    this.PaymentController = new PaymentController(this.CreatePaymentUseCase, this.UpdatePaymentUseCase);
    this.TicketController = new TicketController(this.GetTicketsUseCase, this.GenerateEntryUseCase);
    this.EventController = new EventController(this.GetEventByIdUseCase, this.GetAllEventsUseCase);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getPaymentController(): PaymentController {
    return this.PaymentController;
  }

  public getTicketController(): TicketController {
    return this.TicketController;
  }

  public getEventController(): EventController {
    return this.EventController;
  }
}
