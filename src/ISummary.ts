export interface IMessageDescriptor {
  description: string;
  defaultMessage: string;
}

export interface ISummary {
  locales: string[];

  defaultMessages: {
    [id: string]: IMessageDescriptor;
  };

  messages: {
    [locale: string]: {
      [id: string]: string;
    };
  };
}
