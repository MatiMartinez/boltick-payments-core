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
  data?: EventWithStatus;
}

export interface PR {
  id: string;
  email: string;
  name: string;
  phone: string;
  photo: string;
  slug: string;
}

export interface EventWithStatus extends EventEntity {
  prs: PR[];
  isActive: number;
}
