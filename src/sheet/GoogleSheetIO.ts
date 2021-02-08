import { IConfig } from "../config/config.interface";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { OAuth2Client } from "google-auth-library";

export interface IGoogleSheetRow {
  id: string;
  description: string;
  defaultMessage: string;

  [locale: string]: string;
}

export interface IGoogleSheetData {
  header: string[];
  rows: IGoogleSheetRow[];
}

export interface IGoogleSheetIO {
  read(): Promise<IGoogleSheetData>;

  write(data: IGoogleSheetData): Promise<void>;

  useOAuth2Client(oAuth2Client: OAuth2Client): void;
}

export class GoogleSheetIO implements IGoogleSheetIO {
  private doc: GoogleSpreadsheet;

  constructor(private config: IConfig) {
    this.doc = new GoogleSpreadsheet(this.config.sheetId);
  }

  useOAuth2Client = (oAuth2Client: OAuth2Client) => {
    // any because of problem with @types/google-spreadsheets
    (this.doc as any).useOAuth2Client(oAuth2Client);
  };

  read = async (): Promise<IGoogleSheetData> => {
    const sheet = await this.getFirstSheet();
    const rows = await sheet.getRows();

    return { header: sheet.headerValues, rows: rows as any };
  };

  write = async (data: IGoogleSheetData): Promise<void> => {
    const sheet = await this.getFirstSheet();

    await sheet.clear();
    await sheet.setHeaderRow(data.header);
    await sheet.addRows(data.rows);
  };

  private getFirstSheet = async () => {
    await this.doc.loadInfo();
    return this.doc.sheetsByIndex[0];
  };
}
