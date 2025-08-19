import { IGetAllEventsUseCase, IGetAllEventsUseCaseOutput } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { EventEntity } from "@domain/entities/EventEntity";

export class GetAllEventsUseCase implements IGetAllEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  public async execute(): Promise<IGetAllEventsUseCaseOutput> {
    const events = await this.eventRepository.findAll();
    
    const currentTimestamp = Date.now();
    
    const activeEvents: EventEntity[] = [];
    const finishedEvents: EventEntity[] = [];
    
    events.forEach(event => {
      if (event.endDate > currentTimestamp) {
        activeEvents.push(event);
      } else {
        finishedEvents.push(event);
      }
    });
    
    activeEvents.sort((a, b) => a.startDate - b.startDate);
    finishedEvents.sort((a, b) => b.startDate - a.startDate);
    
    const sortedEvents = [...activeEvents, ...finishedEvents];
    
    return { 
      success: 1, 
      message: "Eventos obtenidos correctamente", 
      data: sortedEvents 
    };
  }
}
