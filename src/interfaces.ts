export interface IMessages {
  [id: string]: {
    description?: string;
    defaultMessage?: string;
  };
}

export interface ILanguages {
  [lang: string]: IMessages;
}

export interface ICombinedMessage {
  id: string;
  description: string;
  defaultMessage: string;

  [locale: string]: string;
}
