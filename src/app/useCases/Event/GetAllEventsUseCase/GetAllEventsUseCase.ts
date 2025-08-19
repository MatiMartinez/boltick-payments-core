import { IGetAllEventsUseCase, IGetAllEventsUseCaseOutput, EventWithStatus } from "./interface";
import { IEventRepository } from "@domain/repositories/IEventRepository";
import { toZonedTime } from "date-fns-tz";

export class GetAllEventsUseCase implements IGetAllEventsUseCase {
  constructor(private eventRepository: IEventRepository) {}

  public async execute(): Promise<IGetAllEventsUseCaseOutput> {
    const events = await this.eventRepository.findAll();
    
    const now = new Date();
    const mendozaTime = toZonedTime(now, "America/Argentina/Mendoza");
    const currentTimestamp = mendozaTime.getTime();
    
    const activeEvents: EventWithStatus[] = [];
    const finishedEvents: EventWithStatus[] = [];
    
    events.forEach(event => {
      const eventWithStatus: EventWithStatus = {
        ...event,
        isActive: event.endDate > currentTimestamp ? 1 : 0
      };
      
      if (eventWithStatus.isActive === 1) {
        activeEvents.push(eventWithStatus);
      } else {
        finishedEvents.push(eventWithStatus);
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
