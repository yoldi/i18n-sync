import { Credentials } from "google-auth-library";
import { promises as fs } from "fs";

export class GoogleSheetOAuth2TokenStore {
  constructor(private tokenFilePath: string) {}

  save = async (token: Credentials) => {
    try {
      const names = this.tokenFilePath.split("/");
      names.pop();
      const tokenDir = names.join("/");
      await fs.mkdir(tokenDir);
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }

    await fs.writeFile(this.tokenFilePath, JSON.stringify(token));
  };

  load = async (): Promise<Credentials> => {
    const data = await fs.readFile(this.tokenFilePath, { encoding: "utf-8" });
    const token = JSON.parse(data);
    return token as Credentials;
  };
}
