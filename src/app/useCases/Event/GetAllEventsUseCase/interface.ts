import { EventEntity } from "@domain/entities/EventEntity";

export interface IGetAllEventsUseCase {
  execute(): Promise<IGetAllEventsUseCaseOutput>;
}

export interface IGetAllEventsUseCaseOutput {
  success: number;
  message: string;
  data?: EventWithStatus[];
}

export interface EventWithStatus extends EventEntity {
  isActive: number;
}
