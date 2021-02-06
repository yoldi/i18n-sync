import { readLangDir } from '../../src/files/readLangDir';

import defaultJSON from '../samples/default.json';
import enUS from '../samples/en-US.json';
import ruRU from '../samples/ru-RU.json';

describe('readLangFile', () => {
  it('works', async () => {
    const messages = await readLangDir('test/samples');

    expect(messages).toMatchObject({
      default: defaultJSON,
      'en-US': enUS,
      'ru-RU': ruRU,
    });
  });
});
