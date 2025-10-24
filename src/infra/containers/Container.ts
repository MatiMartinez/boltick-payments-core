import { CreateFreePaymentUseCase } from "@useCases/Payment/CreateFreePaymentUseCase/CreateFreePaymentUseCase";
import { CreatePaymentUseCase } from "@useCases/Payment/CreatePaymentUseCase/CreatePaymentUseCase";
import { EventController } from "@controllers/EventController";
import { EventDynamoRepository } from "@repositories/EventDynamoRepository";
import { GenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/GenerateEntryUseCase";
import { GetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/GetAllEventsUseCase";
import { GetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/GetEventByIdUseCase";
import { GetTicketsByWalletUseCase } from "@useCases/Ticket/GetTicketsByWalletUseCase.ts/GetTicketsByWalletUseCase";
import { GetTicketsUseCase } from "@useCases/Ticket/GetTicketsUseCase/GetTicketsUseCase";
import { GetTokenBalanceUseCase } from "@useCases/Token/GetTokenBalanceUseCase/GetTokenBalanceUseCase";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { IGenerateEntryUseCase } from "@useCases/Ticket/GenerateEntryUseCase/interface";
import { IGetAllEventsUseCase } from "@useCases/Event/GetAllEventsUseCase/interface";
import { IGetEventByIdUseCase } from "@useCases/Event/GetEventByIdUseCase/interface";
import { IGetTicketsByWalletUseCase } from "@useCases/Ticket/GetTicketsByWalletUseCase.ts/interface";
import { IGetTokenBalanceUseCase } from "@useCases/Token/GetTokenBalanceUseCase/interface";
import { ILogger } from "@commons/Logger/interface";
import { IMercadoPagoService } from "@services/MercadoPago/interface";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { ISolanaService } from "@services/Solana/interface";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { IWebhookService } from "@services/Webhook/interface";
import { Logger } from "@commons/Logger/Logger";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { PaymentController } from "@controllers/PaymentController";
import { PaymentDynamoRepository } from "@repositories/PaymentDynamoRepository";
import { S3Service } from "@services/S3/S3Service";
import { SolanaService } from "@services/Solana/SolanaService";
import { TicketController } from "@controllers/TicketController";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { TicketDynamoRepository } from "@repositories/TicketDynamoRepository";
import { TokenController } from "@controllers/TokenController";
import { UpdatePaymentUseCase } from "@useCases/Payment/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { WebhookService } from "@services/Webhook/WebhookService";
import { ITokenPaymentRepository } from "@domain/repositories/ITokenPaymentRepository";
import { CreateTokenPaymentUseCase } from "@useCases/Payment/CreateTokenPaymentUseCase/CreateTokenPaymentUseCase";
import { TokenPaymentDynamoRepository } from "@repositories/TokenPaymentDynamoRepository";

export class Container {
  private static instance: Container;

  private Logger: ILogger;

  private MercadoPagoService: IMercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: ISolanaService;
  private WebhookService: IWebhookService;

  private PaymentRepository: IPaymentRepository;
  private TokenPaymentRepository: ITokenPaymentRepository;
  private TicketCountRepository: TicketCountRepository;
  private TicketRepository: ITicketRepository;
  private EventRepository: IEventRepository;

  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private CreateFreePaymentUseCase: CreateFreePaymentUseCase;
  private CreateTokenPaymentUseCase: CreateTokenPaymentUseCase;
  private GetTicketsUseCase: GetTicketsUseCase;
  private GetTicketsByWalletUseCase: IGetTicketsByWalletUseCase;
  private GenerateEntryUseCase: IGenerateEntryUseCase;
  private GetEventByIdUseCase: IGetEventByIdUseCase;
  private GetAllEventsUseCase: IGetAllEventsUseCase;
  private GetTokenBalanceUseCase: IGetTokenBalanceUseCase;

  private PaymentController: PaymentController;
  private TicketController: TicketController;
  private EventController: EventController;
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

    this.Logger = Logger.getInstance();

    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl, this.Logger);
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(apiKey);
    this.WebhookService = new WebhookService(env, this.Logger);

    this.PaymentRepository = new PaymentDynamoRepository(this.Logger);
    this.TokenPaymentRepository = new TokenPaymentDynamoRepository(this.Logger);
    this.TicketCountRepository = new TicketCountRepository(this.Logger);
    this.TicketRepository = new TicketDynamoRepository(this.Logger);
    this.EventRepository = new EventDynamoRepository(this.Logger);

    this.CreatePaymentUseCase = new CreatePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.EventRepository,
      this.MercadoPagoService,
      this.Logger,
      appUrl
    );
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);
    this.CreateFreePaymentUseCase = new CreateFreePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.EventRepository,
      this.WebhookService,
      this.Logger
    );
    this.CreateTokenPaymentUseCase = new CreateTokenPaymentUseCase(this.TokenPaymentRepository, this.MercadoPagoService, this.Logger, appUrl);
    this.GetTicketsUseCase = new GetTicketsUseCase(this.S3Service, this.SolanaService);
    this.GetTicketsByWalletUseCase = new GetTicketsByWalletUseCase(this.TicketRepository);
    this.GenerateEntryUseCase = new GenerateEntryUseCase(this.TicketRepository, this.Logger);
    this.GetEventByIdUseCase = new GetEventByIdUseCase(this.EventRepository);
    this.GetAllEventsUseCase = new GetAllEventsUseCase(this.EventRepository);
    this.GetTokenBalanceUseCase = new GetTokenBalanceUseCase(this.SolanaService);

    this.PaymentController = new PaymentController(
      this.CreatePaymentUseCase,
      this.UpdatePaymentUseCase,
      this.CreateFreePaymentUseCase,
      this.CreateTokenPaymentUseCase,
      this.Logger
    );
    this.TicketController = new TicketController(this.GetTicketsUseCase, this.GetTicketsByWalletUseCase, this.GenerateEntryUseCase, this.Logger);
    this.EventController = new EventController(this.GetEventByIdUseCase, this.GetAllEventsUseCase);
    this.TokenController = new TokenController(this.GetTokenBalanceUseCase, this.Logger);
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

  public getTokenController(): TokenController {
    return this.TokenController;
  }
}
