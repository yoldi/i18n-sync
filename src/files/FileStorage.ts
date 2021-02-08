import { IStorage } from "../IStorage";
import { toMap } from "../lib/toMap";
import { ISummary } from "../ISummary";
import { FileIO, IFileData, IFileIO } from "./FileIO";

export class FileStorage implements IStorage {
  constructor(
    private directory: string,
    private defaultName: string,
    private filesIO: IFileIO = new FileIO(directory)
  ) {}

  read = async (): Promise<ISummary> => {
    const files = await this.filesIO.read();

    if (!files.hasOwnProperty(this.defaultName)) {
      throw new Error(`Default locale '${this.defaultName}' is not presented in languages`);
    }

    const locales = Object.keys(files).filter(it => it !== this.defaultName);
    const defaultMessages = files[this.defaultName];

    const ids = Object.keys(defaultMessages);
    const messages = locales
      .map(locale => ({
        key: locale,
        value: ids.map(id => ({ key: id, value: files[locale][id]?.defaultMessage })).reduce(toMap, {})
      }))
      .reduce(toMap, {});

    return {
      locales,
      defaultMessages,
      messages
    };
  };

  write = async (data: ISummary): Promise<void> => {
    const files: IFileData = {
      [this.defaultName]: data.defaultMessages
    };

    data.locales.forEach(locale => {
      files[locale] = {};
      Object.entries(data.messages[locale]).forEach(([id, message]) => {
        files[locale][id] = {
          defaultMessage: message,
          description: data.defaultMessages[id].description
        };
      });
    });

    await this.filesIO.write(files);
  };
}
