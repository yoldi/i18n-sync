import { promises as fs } from 'fs';
import { IMessages } from '../interfaces';

export const readLangFile = async (path: string): Promise<IMessages> => {
  const file = await fs.readFile(path, { encoding: 'utf-8' });
  return JSON.parse(file);
};
