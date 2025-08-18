import { customAlphabet } from "nanoid";
import { IGenerateEntryUseCase, IGenerateEntryUseCaseInput, IGenerateEntryUseCaseOutput } from "./interface";
import { ITicketRepository } from "@domain/repositories/ITicketRepository";
import { ILogger } from "@commons/Logger/interface";

export class GenerateEntryUseCase implements IGenerateEntryUseCase {
  constructor(
    private ticketRepository: ITicketRepository,
    private logger: ILogger
  ) {}

  public async execute(input: IGenerateEntryUseCaseInput): Promise<IGenerateEntryUseCaseOutput> {
    const ticket = await this.ticketRepository.findByTicketNumber(input.ticketNumber);

    if (!ticket) {
      return { success: 0, message: "Ticket no encontrado" };
    }

    if (ticket.used === 1) {
      return { success: 0, message: "Ticket ya utilizado" };
    }

    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const entryCode = customAlphabet(alphabet, 9)();
    const expiresAt = Date.now() + 30000;

    const updatedTicket = {
      ...ticket,
      entryCode,
      entryCodeExpiresAt: expiresAt,
    };

    await this.ticketRepository.update(updatedTicket);

    this.logger.info("[GenerateEntryUseCase] Entry code generated successfully", {
      ticketNumber: ticket.ticketNumber,
      entryCode,
      expiresAt,
    });

    const token = `${ticket.ticketNumber}:${entryCode}:${expiresAt}`;

    return { success: 1, message: "Código de entrada generado correctamente", data: { token } };
  }
}
