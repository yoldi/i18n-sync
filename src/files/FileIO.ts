import { promises as fs } from "fs";
import { toMap } from "../lib/toMap";
import { IMessageDescriptor } from "../ISummary";

export interface IFileData {
  [lang: string]: {
    [id: string]: IMessageDescriptor;
  };
}

export interface IFileIO {
  read(): Promise<IFileData>;

  write(files: IFileData): Promise<void>;
}

export class FileIO implements IFileIO {
  constructor(private directory: string) {}

  read = async (): Promise<IFileData> => {
    const files = await fs.readdir(this.directory, { withFileTypes: true });

    const paths = files
      .filter(it => it.isFile())
      .map(it => it.name)
      .filter(it => it.endsWith(".json"));

    const jsons = await Promise.all(paths.map(it => this.readFile(this.directory + "/" + it)));
    const locales = paths.map(it => it.substring(0, it.length - ".json".length));
    return locales.map((it, key) => ({ key: it, value: jsons[key] })).reduce(toMap, {});
  };

  write = async (files: IFileData) => {
    const promises = Object.entries(files).map(([file, data]) =>
      fs.writeFile(this.directory + "/" + file + ".json", JSON.stringify(data, null, 2))
    );

    await Promise.all(promises);
  };

  private readFile = async (path: string) => {
    const file = await fs.readFile(path, { encoding: "utf-8" });
    return JSON.parse(file);
  };
}
