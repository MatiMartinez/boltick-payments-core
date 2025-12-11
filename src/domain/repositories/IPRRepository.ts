import { PREntity } from "@domain/entities/PREntity";

export interface IPRRepository {
  getPRsByProducer(producer: string): Promise<PREntity[]>;
}
