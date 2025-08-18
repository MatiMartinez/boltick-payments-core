import { IGetAllEventsUseCase, IGetAllEventsUseCaseOutput } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";

export class GetAllEventsUseCase implements IGetAllEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  public async execute(): Promise<IGetAllEventsUseCaseOutput> {
    const events = await this.eventRepository.findAll();
    return { success: 1, message: "Eventos obtenidos correctamente", data: { events } };
  }
}
