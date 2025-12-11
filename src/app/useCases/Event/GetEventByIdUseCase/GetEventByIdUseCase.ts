import { toZonedTime } from "date-fns-tz";
import { EventWithStatus, IGetEventByIdUseCase, IGetEventByIdUseCaseInput, IGetEventByIdUseCaseOutput } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { IPRRepository } from "@domain/repositories/IPRRepository";

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private prRepository: IPRRepository
  ) {}

  public async execute(input: IGetEventByIdUseCaseInput): Promise<IGetEventByIdUseCaseOutput> {
    if (!input.eventId) {
      throw new Error("Event ID is required");
    }

    const event = await this.eventRepository.findById(input.eventId);

    if (!event) {
      return { success: 0, message: "Evento no encontrado" };
    }

    // Obtener PRs de la productora
    const prs = await this.prRepository.getPRsByProducer(event.producer);

    // Transformar PRs al formato que tenía anteriormente (sin createdAt y updatedAt)
    const prsFormatted = prs.map((pr) => ({
      id: pr.id,
      email: pr.email,
      name: pr.name,
      phone: pr.phone,
      photo: pr.photo,
      slug: pr.slug,
    }));

    const now = new Date();
    const mendozaTime = toZonedTime(now, "America/Argentina/Mendoza");
    const currentTimestamp = mendozaTime.getTime();

    const eventWithStatus = {
      ...event,
      prs: prsFormatted,
      isActive: event.endDate > currentTimestamp ? 1 : 0,
    } as EventWithStatus;

    return { success: 1, message: "Evento obtenido correctamente", data: eventWithStatus };
  }
}
