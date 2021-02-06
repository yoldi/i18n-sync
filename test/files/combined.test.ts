import { ILanguages } from '../../src/interfaces';
import {
  fromCombinedMessages,
  toCombinedMessages,
} from '../../src/files/combined';

import defaultJSON from '../samples/default.json';
import enUS from '../samples/en-US.json';
import ruRU from '../samples/ru-RU.json';

describe('combined', () => {
  it('toCombinedMessages', async () => {
    const languages: ILanguages = {
      default: defaultJSON,
      'en-US': enUS,
      'ru-RU': ruRU,
    };

    const messages = toCombinedMessages(languages, 'default');
    expect(messages).toEqual([
      {
        id: 'index.title',
        defaultMessage: 'Надежная IT-инфраструктура для разнообразия решений',
        description: 'Заголовок главной страницы',
        'ru-RU': 'Надежная IT-инфраструктура для разнообразия решений',
        'en-US': 'Reliable IT infrastructure for a variety of solutions',
      },
    ]);
  });

  it('fromCombinedMessages', async () => {
    const languages: ILanguages = {
      default: defaultJSON,
      'en-US': enUS,
      'ru-RU': ruRU,
    };

    const messages = toCombinedMessages(languages, 'default');
    const restoredLanguages = fromCombinedMessages(messages, 'default');

    expect(restoredLanguages).toEqual(languages);
  });
});
