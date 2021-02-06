import { promises as fs } from 'fs';

import { readLangFile } from './readLangFile';
import { toMap } from '../helpers';
import { ILanguages } from '../interfaces';

export const readLangDir = async (path: string): Promise<ILanguages> => {
  const files = await fs.readdir(path, { withFileTypes: true });

  const paths = files
    .filter(it => it.isFile())
    .map(it => it.name)
    .filter(it => it.endsWith('.json'));

  const jsons = await Promise.all(
    paths.map(it => readLangFile(path + '/' + it))
  );

  const locales = paths.map(it => it.substring(0, it.length - '.json'.length));

  return locales
    .map((it, key) => ({ key: it, value: jsons[key] }))
    .reduce(toMap, {});
};
