import { IConfig } from "./config.interface";
import { readConfig } from "./readConfig";

export interface IConfigMaker {
  loadFromFile(path: string): Promise<void>;

  getConfig(): IConfig;

  updateConfig(config: Partial<IConfig>): void;
}

export const CONFIG_DEFAULTS: Partial<IConfig> = {
  langDir: "src/lang",
  tokenFile: ".credentials/token.json",
  oauthFile: ".credentials/oauth.json"
};

export class ConfigMaker implements IConfigMaker {
  private config: Partial<IConfig>;

  constructor(config: Partial<IConfig> = {}) {
    this.config = {
      ...CONFIG_DEFAULTS,
      ...config
    };
  }

  getConfig = (): IConfig => this.config as IConfig;

  loadFromFile = async (path: string) => {
    const config = await readConfig(path);
    this.updateConfig(config);
  };

  updateConfig = (config: Partial<IConfig>) => {
    this.config = { ...this.config, ...config };
  };
}
