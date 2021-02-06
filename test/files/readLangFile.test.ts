import { readLangFile } from '../../src/files/readLangFile';

import enUS from '../samples/en-US.json';

describe('readLangFile', () => {
  it('works', async () => {
    const messages = await readLangFile('test/samples/en-US.json');
    expect(messages).toMatchObject(enUS);
  });
});
