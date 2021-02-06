import { Credentials, OAuth2Client } from 'google-auth-library';
import { promises as fs } from 'fs';

import { question } from '../lib/question';
import { IConfig } from '../config';

export const getAuth = async (config: IConfig) => {
  if (!config.oauth) {
    throw new Error('No credentials');
  }
  return await authorize(config);
};

async function authorize(config: IConfig) {
  const oAuth2Client = new OAuth2Client(
    config.oauth.clientId,
    config.oauth.clientSecret,
    config.oauth.redirectUri
  );

  try {
    const token = await fs.readFile(config.tokenFile, { encoding: 'utf-8' });
    oAuth2Client.credentials = JSON.parse(token);
    return oAuth2Client;
  } catch (e) {
    console.log('No stored credentials', e);
  }

  const token = await getNewToken(oAuth2Client);

  await storeToken(token, config);
  console.log('Token stored to ' + config.tokenFile);

  oAuth2Client.credentials = token;

  return oAuth2Client;
}

async function getNewToken(oAuth2Client: OAuth2Client): Promise<Credentials> {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });
  console.log('Authorize this app by visiting this url: ', authUrl);

  const code = await question('Enter the code from that page here: ');
  const tokenResponse = await oAuth2Client.getToken(code);
  return tokenResponse.tokens;
}

async function storeToken(token: Credentials, config: IConfig) {
  try {
    const names = config.tokenFile.split('/');
    names.pop();
    const tokenDir = names.join('/');
    await fs.mkdir(tokenDir);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  await fs.writeFile(config.tokenFile, JSON.stringify(token));
}
