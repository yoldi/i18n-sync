import { GoogleSheetStorage } from "../../src/sheet/GoogleSheetStorage";
import { IGoogleSheetData } from "../../src/sheet/GoogleSheetIO";

const sheet: IGoogleSheetData = {
  header: ["id", "description", "defaultMessage", "en-US", "ru-RU"],
  rows: [
    {
      id: "index.subtitle",
      description: "Подзаголовок главной страницы",
      defaultMessage: "Быстрое развертывание виртуальных серверов по всему миру"
    },
    {
      id: "index.title",
      description: "Заголовок главной страницы",
      defaultMessage: "Надежная IT-инфраструктура для разнообразия решений",
      "en-US": "Reliable IT infrastructure for a variety of solutions",
      "ru-RU": "Надежная IT-инфраструктура для разнообразия решений"
    }
  ]
};

const summary = {
  locales: ["en-US", "ru-RU"],
  defaultMessages: {
    "index.subtitle": {
      description: "Подзаголовок главной страницы",
      defaultMessage: "Быстрое развертывание виртуальных серверов по всему миру"
    },
    "index.title": {
      description: "Заголовок главной страницы",
      defaultMessage: "Надежная IT-инфраструктура для разнообразия решений"
    }
  },
  messages: {
    "en-US": {
      "index.title": "Reliable IT infrastructure for a variety of solutions"
    },
    "ru-RU": {
      "index.title": "Надежная IT-инфраструктура для разнообразия решений"
    }
  }
};

describe("GoogleSheetStorage", () => {
  it("read", async () => {
    const storage = new GoogleSheetStorage({} as any, {
      read: async () => sheet,
      write: async data => {},
      useOAuth2Client: () => {}
    });
    const actualSummary = await storage.read();

    expect(actualSummary).toMatchObject(summary);
  });

  it("write", async () => {
    let actualFiles: IGoogleSheetData | undefined = undefined;

    const storage = new GoogleSheetStorage({} as any, {
      read: async () => ({} as any),
      write: async data => {
        actualFiles = data;
      },
      useOAuth2Client: () => {}
    });

    await storage.write(summary);

    expect(actualFiles).toMatchObject(sheet);
  });
});
