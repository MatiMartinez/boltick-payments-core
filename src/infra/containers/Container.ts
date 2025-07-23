import { PaymentController } from "@controllers/PaymentController";
import { TicketController } from "@controllers/TicketController";
import { PaymentRepository } from "@repositories/PaymentRepository";
import { Logger } from "@commons/Logger/Logger";
import { ILogger } from "@commons/Logger/interface";
import { MercadoPagoService } from "@services/MercadoPago/MercadoPagoService";
import { S3Service } from "@services/S3/S3Service";
import { SolanaService } from "@services/Solana/SolanaService";
import { CreatePaymentUseCase } from "@useCases/CreatePaymentUseCase/CreatePaymentUseCase";
import { GetTicketsUseCase } from "@useCases/GetTicketsUseCase/GetTicketsUseCase";
import { UpdatePaymentUseCase } from "@useCases/UpdatePaymentUseCase/UpdatePaymentUseCase";
import { TicketCountRepository } from "@repositories/TicketCountRepository";

export class Container {
  private static instance: Container;

  private logger: ILogger;
  private MercadoPagoService: MercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: SolanaService;
  private PaymentRepository: PaymentRepository;
  private TicketCountRepository: TicketCountRepository;
  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private GetTicketsUseCase: GetTicketsUseCase;
  private PaymentController: PaymentController;
  private TicketController: TicketController;

  private constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN as string;
    const appUrl = process.env.APP_URL as string;
    const apiKey = process.env.SOLANA_API_KEY as string;

    if (!accessToken) {
      throw new Error(
        "MERCADOPAGO_ACCESS_TOKEN environment variable is required"
      );
    }
    if (!appUrl) {
      throw new Error("APP_URL environment variable is required");
    }
    if (!apiKey) {
      throw new Error("SOLANA_API_KEY environment variable is required");
    }

    this.logger = Logger.getInstance();

    this.MercadoPagoService = new MercadoPagoService(
      accessToken,
      appUrl,
      this.logger
    );
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(apiKey);
    this.PaymentRepository = new PaymentRepository();
    this.TicketCountRepository = new TicketCountRepository();
    this.CreatePaymentUseCase = new CreatePaymentUseCase(
      this.PaymentRepository,
      this.TicketCountRepository,
      this.MercadoPagoService
    );
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(
      this.PaymentRepository
    );
    this.GetTicketsUseCase = new GetTicketsUseCase(
      this.S3Service,
      this.SolanaService
    );
    this.PaymentController = new PaymentController(
      this.CreatePaymentUseCase,
      this.UpdatePaymentUseCase
    );
    this.TicketController = new TicketController(this.GetTicketsUseCase);
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
