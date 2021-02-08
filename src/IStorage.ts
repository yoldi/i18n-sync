import { ISummary } from "./ISummary";

export interface IStorage {
  read(): Promise<ISummary>;

  write(data: ISummary): Promise<void>;
}
