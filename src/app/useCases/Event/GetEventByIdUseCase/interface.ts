import { EventEntity } from "@domain/entities/EventEntity";

export interface IGetEventByIdUseCase {
  execute(input: IGetEventByIdUseCaseInput): Promise<IGetEventByIdUseCaseOutput>;
}

export interface IGetEventByIdUseCaseInput {
  eventId: string;
}

export interface IGetEventByIdUseCaseOutput {
  success: number;
  message: string;
  data?: EventEntity;
}
