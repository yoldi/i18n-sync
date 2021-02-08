import { IConfig } from "./config/config.interface";
import { GoogleSheetStorage } from "./sheet/GoogleSheetStorage";
import { FileStorage } from "./files/FileStorage";
import { GoogleSheetOAuth2 } from "./sheet/auth/GoogleSheetOAuth2";

export class I18nSync {
  constructor(private config: IConfig) {}

  pull = async () => {
    const files = await this.files();
    const sheet = await this.sheet();

    const summary = await sheet.read();
    await files.write(summary);
  };

  push = async () => {
    const files = await this.files();
    const sheet = await this.sheet();

    const summary = await files.read();
    await sheet.write(summary);
  };

  private sheet = async () => {
    const sheet = new GoogleSheetStorage(this.config);

    const authManager = new GoogleSheetOAuth2(this.config);
    const auth = await authManager.authorize();

    sheet.useOAuth2Client(auth);
    return sheet;
  };

  private files = async () => {
    return new FileStorage(this.config.langDir, "default");
  };
}
