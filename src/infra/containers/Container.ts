// Services
import { ILogger } from "@commons/Logger/interface";
import { Logger } from "@commons/Logger/Logger";
import { IMercadoPagoService } from "@services/MercadoPago/interface";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { S3Service } from "@services/S3/S3Service";
import { ISolanaService } from "@services/Solana/interface";
import { SolanaService } from "@services/Solana/SolanaService";
import { IWebhookService } from "@services/Webhook/interface";
import { WebhookService } from "@services/Webhook/WebhookService";

// Repositories
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { ITokenPaymentRepository } from "@domain/repositories/ITokenPaymentRepository";
import { EventDynamoRepository } from "@repositories/EventDynamoRepository";
import { PaymentDynamoRepository } from "@repositories/PaymentDynamoRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { TicketDynamoRepository } from "@repositories/TicketDynamoRepository";
import { TokenPaymentDynamoRepository } from "@repositories/TokenPaymentDynamoRepository";

// Use Cases
import { CreateFreePaymentUseCase } from "@useCases/Payment/CreateFreePaymentUseCase/CreateFreePaymentUseCase";
import { CreatePaymentUseCase } from "@useCases/Payment/CreatePaymentUseCase/CreatePaymentUseCase";
import { CreateTokenPaymentUseCase } from "@useCases/Payment/CreateTokenPaymentUseCase/CreateTokenPaymentUseCase";
import { UpdatePaymentUseCase } from "@useCases/Payment/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { GetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/GetAllEventsUseCase";
import { GetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/GetEventByIdUseCase";
import { GenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/GenerateEntryUseCase";
import { GetTicketsByWalletUseCase } from "@useCases/Ticket/GetTicketsByWalletUseCase.ts/GetTicketsByWalletUseCase";
import { GetTicketsUseCase } from "@useCases/Ticket/GetTicketsUseCase/GetTicketsUseCase";
import { IGetTokenBalanceUseCase } from "@useCases/Token/GetTokenBalanceUseCase/interface";
import { GetTokenBalanceUseCase } from "@useCases/Token/GetTokenBalanceUseCase/GetTokenBalanceUseCase";
import { IGenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/interface";
import { IGetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/interface";
import { IGetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/interface";
import { IGetTicketsByWalletUseCase } from "@useCases/Ticket/GetTicketsByWalletUseCase.ts/interface";

// Controllers
import { EventController } from "@controllers/EventController";
import { PaymentController } from "@controllers/PaymentController";
import { TicketController } from "@controllers/TicketController";
import { TokenController } from "@controllers/TokenController";

export class Container {
  private static instance: Container;

  // Services
  private Logger: ILogger;
  private MercadoPagoService: IMercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: ISolanaService;
  private WebhookService: IWebhookService;

  // Repositories
  private EventRepository: IEventRepository;
  private PaymentRepository: IPaymentRepository;
  private TicketCountRepository: TicketCountRepository;
  private TicketRepository: ITicketRepository;
  private TokenPaymentRepository: ITokenPaymentRepository;

  // Use Cases
  private CreateFreePaymentUseCase: CreateFreePaymentUseCase;
  private CreatePaymentUseCase: CreatePaymentUseCase;
  private CreateTokenPaymentUseCase: CreateTokenPaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private GetAllEventsUseCase: IGetAllEventsUseCase;
  private GetEventByIdUseCase: IGetEventByIdUseCase;
  private GenerateEntryUseCase: IGenerateEntryUseCase;
  private GetTicketsByWalletUseCase: IGetTicketsByWalletUseCase;
  private GetTicketsUseCase: GetTicketsUseCase;
  private GetTokenBalanceUseCase: IGetTokenBalanceUseCase;

  // Controllers
  private EventController: EventController;
  private PaymentController: PaymentController;
  private TicketController: TicketController;
  private TokenController: TokenController;

  private constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN as string;
    const appUrl = process.env.APP_URL as string;
    const apiKey = process.env.SOLANA_API_KEY as string;
    const env = process.env.ENV as "QA" | "PROD";
    const web3AuthClientId = process.env.WEB3AUTH_CLIENT_ID as string;
    const boltMintAddress = process.env.BOLT_MINT_ADDRESS as string;
    const rpcBoltUrl = process.env.RPC_BOLT_URL as string;

    if (!accessToken) {
      throw new Error("Falta la variable de entorno MERCADOPAGO_ACCESS_TOKEN");
    }
    if (!appUrl) {
      throw new Error("Falta la variable de entorno APP_URL");
    }
    if (!apiKey) {
      throw new Error("Falta la variable de entorno SOLANA_API_KEY");
    }
    if (!env) {
      throw new Error("Falta la variable de entorno ENV");
    }
    if (!web3AuthClientId) {
      throw new Error("Falta la variable de entorno WEB3AUTH_CLIENT_ID");
    }
    if (!boltMintAddress) {
      throw new Error("Falta la variable de entorno BOLT_MINT_ADDRESS");
    }
    if (!rpcBoltUrl) {
      throw new Error("Falta la variable de entorno RPC_BOLT_URL");
    }

    // Initialize Services
    this.Logger = Logger.getInstance();
    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl, this.Logger);
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(apiKey);
    this.WebhookService = new WebhookService(env, this.Logger);

    // Initialize Repositories
    this.EventRepository = new EventDynamoRepository(this.Logger);
    this.PaymentRepository = new PaymentDynamoRepository(this.Logger);
    this.TicketCountRepository = new TicketCountRepository(this.Logger);
    this.TicketRepository = new TicketDynamoRepository(this.Logger);
    this.TokenPaymentRepository = new TokenPaymentDynamoRepository(this.Logger);

    // Initialize Use Cases
    this.CreateFreePaymentUseCase = new CreateFreePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.EventRepository,
      this.WebhookService,
      this.Logger
    );
    this.CreatePaymentUseCase = new CreatePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.EventRepository,
      this.MercadoPagoService,
      this.Logger,
      appUrl
    );
    this.CreateTokenPaymentUseCase = new CreateTokenPaymentUseCase(this.TokenPaymentRepository, this.MercadoPagoService, this.Logger, appUrl);
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);

    this.GetAllEventsUseCase = new GetAllEventsUseCase(this.EventRepository);
    this.GetEventByIdUseCase = new GetEventByIdUseCase(this.EventRepository);

    this.GenerateEntryUseCase = new GenerateEntryUseCase(this.TicketRepository, this.Logger);
    this.GetTicketsByWalletUseCase = new GetTicketsByWalletUseCase(this.TicketRepository);
    this.GetTicketsUseCase = new GetTicketsUseCase(this.S3Service, this.SolanaService);

    this.GetTokenBalanceUseCase = new GetTokenBalanceUseCase(this.SolanaService);

    // Initialize Controllers
    this.EventController = new EventController(this.GetEventByIdUseCase, this.GetAllEventsUseCase);
    this.PaymentController = new PaymentController(
      this.CreatePaymentUseCase,
      this.UpdatePaymentUseCase,
      this.CreateFreePaymentUseCase,
      this.CreateTokenPaymentUseCase,
      this.Logger
    );
    this.TicketController = new TicketController(this.GetTicketsUseCase, this.GetTicketsByWalletUseCase, this.GenerateEntryUseCase, this.Logger);
    this.TokenController = new TokenController(this.GetTokenBalanceUseCase, this.Logger);
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getEventController(): EventController {
    return this.EventController;
  }

  public getPaymentController(): PaymentController {
    return this.PaymentController;
  }

  public getTicketController(): TicketController {
    return this.TicketController;
  }

  public getTokenController(): TokenController {
    return this.TokenController;
  }
}
