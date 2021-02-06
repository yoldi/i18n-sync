import { GoogleSpreadsheet } from 'google-spreadsheet';
import { getAuth } from './auth';
import { ICombinedMessage } from '../interfaces';
import { toMap } from '../helpers';
import { IConfig } from '../config';

export const getSheet = async (config: IConfig) => {
  const doc = new GoogleSpreadsheet(config.sheetId);
  const auth = await getAuth(config);
  // problem with @types/google-spreadsheets
  (doc as any).useOAuth2Client(auth);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
};

export const readFromSheet = async (
  config: IConfig
): Promise<ICombinedMessage[]> => {
  const sheet = await getSheet(config);
  const rows = await sheet.getRows();

  const locales = sheet.headerValues.filter(
    it => !['id', 'description', 'defaultMessage'].includes(it)
  );

  return rows.map(it => ({
    id: it.id,
    description: it.description,
    defaultMessage: it.defaultMessage,
    ...locales
      .map(locale => ({
        key: locale,
        value: it[locale],
      }))
      .reduce(toMap, {}),
  }));
};

export const writeToSheet = async (
  messages: ICombinedMessage[],
  config: IConfig
) => {
  const sheet = await getSheet(config);

  await sheet.clear();

  await sheet.setHeaderRow(Object.keys(messages[0]));
  await sheet.addRows(messages);
};
