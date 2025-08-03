import { IGenerateEntryUseCase, IGenerateEntryUseCaseInput, IGenerateEntryUseCaseOutput } from "./interface";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { IJWTService } from "@services/JWT/interface";

export class GenerateEntryUseCase implements IGenerateEntryUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private jwtService: IJWTService
  ) {}

  public async execute(input: IGenerateEntryUseCaseInput): Promise<IGenerateEntryUseCaseOutput> {
    const ticket = await this.ticketRepository.findByTicketNumber(input.ticketNumber);

    if (!ticket) {
      return { result: 0, data: { token: "" }, message: "Ticket no encontrado" };
    }

    if (ticket.used === 1) {
      return { result: 0, data: { token: "" }, message: "Ticket ya utilizado" };
    }

    const payload = {
      ticketNumber: input.ticketNumber,
    };

    const token = this.jwtService.generateAccessToken(payload, 60);

    return { result: 1, data: { token }, message: "Token generado correctamente" };
  }
}
