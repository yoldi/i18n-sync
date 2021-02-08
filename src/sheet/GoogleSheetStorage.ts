import { IStorage } from "../IStorage";
import { ISummary } from "../ISummary";
import { toMap } from "../lib/toMap";
import { IConfig } from "../config/config.interface";
import { GoogleSheetIO, IGoogleSheetIO } from "./GoogleSheetIO";
import { OAuth2Client } from "google-auth-library";

export class GoogleSheetStorage implements IStorage {
  constructor(private config: IConfig, private googleSheetIO: IGoogleSheetIO = new GoogleSheetIO(config)) {}

  useOAuth2Client = (oAuth2Client: OAuth2Client) => {
    this.googleSheetIO.useOAuth2Client(oAuth2Client);
  };

  read = async (): Promise<ISummary> => {
    const data = await this.googleSheetIO.read();

    const locales = data.header.filter(it => !["id", "description", "defaultMessage"].includes(it));

    const defaultMessages = data.rows
      .map(it => ({
        key: it.id,
        value: {
          description: it.description,
          defaultMessage: it.defaultMessage
        }
      }))
      .reduce(toMap, {});

    const messages = locales
      .map(locale => ({
        key: locale,
        value: data.rows.map(it => ({ key: it.id, value: it[locale] })).reduce(toMap, {})
      }))
      .reduce(toMap, {});

    return {
      locales: locales,
      defaultMessages,
      messages
    };
  };

  write = async (data: ISummary): Promise<void> => {
    const rows = Object.entries(data.defaultMessages).map(([id, { description, defaultMessage }]) => ({
      id,
      description,
      defaultMessage,
      ...data.locales
        .map(locale => ({
          key: locale,
          value: data.messages[locale][id]
        }))
        .reduce(toMap, {})
    }));

    await this.googleSheetIO.write({
      header: ["id", "description", "defaultMessage", ...data.locales],
      rows
    });
  };
}
