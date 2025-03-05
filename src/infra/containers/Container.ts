import { PaymentController } from '@controllers/PaymentController';
import { TicketController } from '@controllers/TicketController';
import { PaymentRepository } from '@repositories/PaymentRepository';
import { MercadoPagoService } from '@services/MercadoPago/MercadoPagoService';
import { S3Service } from '@services/S3/S3Service';
import { SolanaService } from '@services/Solana/SolanaService';
import { CreatePaymentUseCase } from '@useCases/CreatePayment';
import { GetTicketsUseCase } from '@useCases/GetTickets';
import { UpdatePaymentUseCase } from '@useCases/UpdatePayment';

export class Container {
  private static instance: Container;

  private MercadoPagoService: MercadoPagoService;
  private S3Service: S3Service;
  private SolanaService: SolanaService;
  private PaymentRepository: PaymentRepository;
  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private GetTicketsUseCase: GetTicketsUseCase;
  private PaymentController: PaymentController;
  private TicketController: TicketController;

  private constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN as string;
    const appUrl = process.env.APP_URL as string;
    const rpcEndpoint = 'https://api.devnet.solana.com';

    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl);
    this.S3Service = new S3Service();
    this.SolanaService = new SolanaService(rpcEndpoint);
    this.PaymentRepository = new PaymentRepository();
    this.CreatePaymentUseCase = new CreatePaymentUseCase(this.PaymentRepository, this.MercadoPagoService);
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);
    this.GetTicketsUseCase = new GetTicketsUseCase(this.S3Service, this.SolanaService);
    this.PaymentController = new PaymentController(this.CreatePaymentUseCase, this.UpdatePaymentUseCase);
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
