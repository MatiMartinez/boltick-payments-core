import { IGetEventByIdUseCase, IGetEventByIdUseCaseInput, IGetEventByIdUseCaseOutput } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";

export class GetEventByIdUseCase implements IGetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {}

  public async execute(input: IGetEventByIdUseCaseInput): Promise<IGetEventByIdUseCaseOutput> {
    if (!input.eventId) {
      throw new Error("Event ID is required");
    }

    const event = await this.eventRepository.findById(input.eventId);

    if (!event) {
      return { success: 0, message: "Evento no encontrado" };
    }

    return { success: 1, message: "Evento obtenido correctamente", data: event };
  }
}
