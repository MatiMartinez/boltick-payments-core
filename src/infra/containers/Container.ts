import { PaymentController } from '@controllers/PaymentController';
import { PaymentRepository } from '@repositories/PaymentRepository';
import { MercadoPagoService } from '@services/MercadoPago/MercadoPagoService';
import { CreatePaymentUseCase } from '@useCases/CreatePayment';
import { UpdatePaymentUseCase } from '@useCases/UpdatePayment';

export class Container {
  private static instance: Container;

  private MercadoPagoService: MercadoPagoService;
  private PaymentRepository: PaymentRepository;
  private CreatePaymentUseCase: CreatePaymentUseCase;
  private UpdatePaymentUseCase: UpdatePaymentUseCase;
  private PaymentController: PaymentController;

  private constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN as string;
    const appUrl = process.env.APP_URL as string;

    this.MercadoPagoService = new MercadoPagoService(accessToken, appUrl);
    this.PaymentRepository = new PaymentRepository();
    this.CreatePaymentUseCase = new CreatePaymentUseCase(this.PaymentRepository, this.MercadoPagoService);
    this.UpdatePaymentUseCase = new UpdatePaymentUseCase(this.PaymentRepository);
    this.PaymentController = new PaymentController(this.CreatePaymentUseCase, this.UpdatePaymentUseCase);
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
}
