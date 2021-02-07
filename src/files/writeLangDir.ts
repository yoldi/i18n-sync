import { promises as fs } from 'fs';
import { ILanguages } from '../interfaces';

export const writeLangDir = async (langDir: string, languages: ILanguages) => {
  const files = Object.keys(languages);

  const promises = files.map(it =>
    fs.writeFile(
      langDir + '/' + it + '.json',
      JSON.stringify(languages[it], null, 2) + '\n'
    )
  );

  await Promise.all(promises);
};
