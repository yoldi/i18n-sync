import { Credentials, OAuth2Client } from "google-auth-library";
import { question } from "../../lib/question";
import { IConfig } from "../../config/config.interface";
import { GoogleSheetOAuth2TokenStore } from "./GoogleSheetOAuth2TokenStore";
import { promises as fs } from "fs";

export class GoogleSheetOAuth2 {
  constructor(
    private config: IConfig,
    private tokenStore: GoogleSheetOAuth2TokenStore = new GoogleSheetOAuth2TokenStore(config.tokenFile)
  ) {}

  private readOAuthSecrets = async () => {
    const oauthFile = await fs.readFile(this.config.oauthFile, { encoding: "utf-8" });
    const oauthJson = JSON.parse(oauthFile);
    return {
      clientId: oauthJson["installed"]["client_id"],
      clientSecret: oauthJson["installed"]["client_secret"],
      redirectUri: oauthJson["installed"]["redirect_uris"][0]
    };
  };

  async authorize(): Promise<OAuth2Client> {
    if (!this.config.oauthFile) {
      throw new Error("No credentials");
    }

    const secrets = await this.readOAuthSecrets();

    const oAuth2Client = new OAuth2Client(secrets.clientId, secrets.clientSecret, secrets.redirectUri);

    try {
      oAuth2Client.credentials = await this.tokenStore.load();
      return oAuth2Client;
    } catch (e) {
      console.log("No stored credentials", e);
    }

    const token = await this.getNewToken(oAuth2Client);
    await this.tokenStore.save(token);

    console.log("Token stored to " + this.config.tokenFile);
    oAuth2Client.credentials = token;

    return oAuth2Client;
  }

  private async getNewToken(oAuth2Client: OAuth2Client): Promise<Credentials> {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/spreadsheets"
    });
    console.log("Authorize this app by visiting this url: ", authUrl);

    const code = await question("Enter the code from that page here: ");
    const tokenResponse = await oAuth2Client.getToken(code);
    return tokenResponse.tokens;
  }
}
