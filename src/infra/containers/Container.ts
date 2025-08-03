import { ILogger } from "@commons/Logger/interface";
import { Logger } from "@commons/Logger/Logger";

import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { S3Service } from "@services/S3/S3Service";
import { SolanaService } from "@services/Solana/SolanaService";
import { IJWTService } from "@services/JWT/interface";
import { JWTService } from "@services/JWT/JWTService";

import { PaymentRepository } from "@repositories/PaymentRepository";
import { TicketCountRepository } from "@repositories/TicketCountRepository";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { TicketDynamoRepository } from "@repositories/TicketDynamoRepository";

import { CreatePaymentUseCase } from "@useCases/CreatePaymentUseCase/CreatePaymentUseCase";
import { UpdatePaymentUseCase } from "@useCases/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { GetTicketsUseCase } from "@useCases/GetTicketsUseCase/GetTicketsUseCase";
import { IGenerateEntryUseCase } from "@useCases/GenerateEntryUseCase/interface";
import { GenerateEntryUseCase } from "@useCases/GenerateEntryUseCase/GenerateEntryUseCase";

import { PaymentController } from "@controllers/PaymentController";
import { TicketController } from "@controllers/TicketController";

export class Container {
  private static instance: Container;

  private logger: ILogger;
  private MercadoPagoService: MercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: SolanaService;
  private jwtService: IJWTService;

  private PaymentRepository: PaymentRepository;
  private TicketCountRepository: TicketCountRepository;
  private TicketRepository: ITicketRepository;

  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private GetTicketsUseCase: GetTicketsUseCase;
  private GenerateEntryUseCase: IGenerateEntryUseCase;

  private PaymentController: PaymentController;
  private TicketController: TicketController;

  private constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN as string;
    const appUrl = process.env.APP_URL as string;
    const apiKey = process.env.SOLANA_API_KEY as string;
    const jwtSecret = process.env.JWT_SECRET as string;

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN environment variable is required");
    }
    if (!appUrl) {
      throw new Error("APP_URL environment variable is required");
    }
    if (!apiKey) {
      throw new Error("SOLANA_API_KEY environment variable is required");
    }
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is required");
    }

    this.logger = Logger.getInstance();

    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl, this.logger);
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(apiKey);
    this.jwtService = new JWTService(jwtSecret);

    this.PaymentRepository = new PaymentRepository();
    this.TicketCountRepository = new TicketCountRepository();
    this.TicketRepository = new TicketDynamoRepository();

    this.CreatePaymentUseCase = new CreatePaymentUseCase(this.PaymentRepository, this.TicketCountRepository, this.MercadoPagoService);
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);
    this.GetTicketsUseCase = new GetTicketsUseCase(this.S3Service, this.SolanaService);
    this.GenerateEntryUseCase = new GenerateEntryUseCase(this.TicketRepository, this.jwtService);

    this.PaymentController = new PaymentController(this.CreatePaymentUseCase, this.UpdatePaymentUseCase);
    this.TicketController = new TicketController(this.GetTicketsUseCase, this.GenerateEntryUseCase);
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
}
