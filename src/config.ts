import { promises as fs } from 'fs';

export interface IConfigOAuth {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface IConfig {
  sheetId: string;
  langDir: string;
  oauthFile: string;
  oauth: IConfigOAuth;
  tokenFile: string;
}

export const configFromFile = async (path: string): Promise<IConfig> => {
  const file = await fs.readFile(path, { encoding: 'utf-8' });
  const json = JSON.parse(file);
  const config = await ConfigFromJSON(json);
  return config;
};

export const ConfigFromJSON = async (json: any): Promise<IConfig> => {
  const config = {
    sheetId: json['sheetId'],
    langDir: json['langDir'],
    tokenFile: json['tokenFile'],
    oauthFile: json['oauthFile'],
  };

  const oauthFile = await fs.readFile(config.oauthFile, { encoding: 'utf-8' });
  const oauthJson = JSON.parse(oauthFile);
  const oauth = {
    clientId: oauthJson['installed']['client_id'],
    clientSecret: oauthJson['installed']['client_secret'],
    redirectUri: oauthJson['installed']['redirect_uris'][0],
  };

  return {
    ...config,
    oauth,
  };
};
