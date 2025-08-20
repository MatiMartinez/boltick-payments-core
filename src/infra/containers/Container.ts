import { ILogger } from "@commons/Logger/interface";
import { Logger } from "@commons/Logger/Logger";

import { IMercadoPagoService } from "@services/MercadoPago/interface";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { S3Service } from "@services/S3/S3Service";
import { ISolanaService } from "@services/Solana/interface";
import { SolanaService } from "@services/Solana/SolanaService";
import { IWebhookService } from "@services/Webhook/interface";
import { WebhookService } from "@services/Webhook/WebhookService";

import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { PaymentDynamoRepository } from "@repositories/PaymentDynamoRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { TicketDynamoRepository } from "@repositories/TicketDynamoRepository";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { EventDynamoRepository } from "@repositories/EventDynamoRepository";

import { CreatePaymentUseCase } from "@useCases/Payment/CreatePaymentUseCase/CreatePaymentUseCase";
import { UpdatePaymentUseCase } from "@useCases/Payment/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { CreateFreePaymentUseCase } from "@useCases/Payment/CreateFreePaymentUseCase/CreateFreePaymentUseCase";
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

  private MercadoPagoService: IMercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: ISolanaService;
  private WebhookService: IWebhookService;

  private PaymentRepository: IPaymentRepository;
  private TicketCountRepository: TicketCountRepository;
  private TicketRepository: ITicketRepository;
  private EventRepository: IEventRepository;

  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private CreateFreePaymentUseCase: CreateFreePaymentUseCase;
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
    const env = process.env.ENV as "QA" | "PROD";

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    if (!appUrl) {
      throw new Error("APP_URL environment variable is required");
    }
    if (!apiKey) {
      throw new Error("SOLANA_API_KEY environment variable is required");
    }
    if (!env) {
      throw new Error("ENV environment variable is required");
    }

    this.logger = Logger.getInstance();

    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl, this.logger);
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(apiKey);
    this.WebhookService = new WebhookService(env, this.logger);

    this.PaymentRepository = new PaymentDynamoRepository(this.logger);
    this.TicketCountRepository = new TicketCountRepository();
    this.TicketRepository = new TicketDynamoRepository();
    this.EventRepository = new EventDynamoRepository(this.logger);

    this.CreatePaymentUseCase = new CreatePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.EventRepository,
      this.MercadoPagoService,
      this.logger
    );
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);
    this.CreateFreePaymentUseCase = new CreateFreePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.EventRepository,
      this.WebhookService,
      this.logger
    );
    this.GetTicketsUseCase = new GetTicketsUseCase(this.S3Service, this.SolanaService);
    this.GenerateEntryUseCase = new GenerateEntryUseCase(this.TicketRepository, this.logger);
    this.GetEventByIdUseCase = new GetEventByIdUseCase(this.EventRepository);
    this.GetAllEventsUseCase = new GetAllEventsUseCase(this.EventRepository);

    this.PaymentController = new PaymentController(this.CreatePaymentUseCase, this.UpdatePaymentUseCase, this.CreateFreePaymentUseCase, this.logger);
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
