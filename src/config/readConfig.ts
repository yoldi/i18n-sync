import { promises as fs } from "fs";
import { IConfig } from "./config.interface";

export const readConfig = async (path: string): Promise<IConfig> => {
  const file = await fs.readFile(path, { encoding: "utf-8" });
  return JSON.parse(file);
};
