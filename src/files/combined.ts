import { ICombinedMessage, ILanguages } from '../interfaces';
import { toMap } from '../helpers';

export const toCombinedMessages = (
  languages: ILanguages,
  defaultLocale: string
): ICombinedMessage[] => {
  if (!languages.hasOwnProperty(defaultLocale)) {
    throw new Error(
      `Default locale '${defaultLocale}' is not presented in languages`
    );
  }

  const locales = Object.keys(languages).filter(it => it !== defaultLocale);
  const defaultMessages = languages[defaultLocale];
  const ids = Object.keys(defaultMessages);

  return ids.map(id => ({
    id: id,
    description: '',
    defaultMessage: '',
    ...defaultMessages[id],
    ...locales
      .map(lang => ({
        key: lang,
        value: languages[lang][id].defaultMessage,
      }))
      .reduce(toMap, {}),
  }));
};

export const fromCombinedMessages = (
  messages: ICombinedMessage[],
  defaultLocale: string
): ILanguages => {
  const languages: ILanguages = {};

  const locales = Object.keys(messages[0]).filter(
    it => !['id', 'description', 'defaultMessage', defaultLocale].includes(it)
  );

  locales.forEach(locale => {
    languages[locale] = {};
    languages[defaultLocale] = {};
  });

  messages.forEach(message => {
    locales.forEach(locale => {
      languages[locale][message.id] = {
        defaultMessage: message[locale],
        description: message.description,
      };
    });

    languages[defaultLocale][message.id] = {
      defaultMessage: message.defaultMessage,
      description: message.description,
    };
  });

  return languages;
};
