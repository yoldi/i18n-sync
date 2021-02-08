import { FileStorage } from "../../src/files/FileStorage";
import { IFileData } from "../../src/files/FileIO";

const files = {
  default: {
    "index.subtitle": {
      description: "Подзаголовок главной страницы",
      defaultMessage: "Быстрое развертывание виртуальных серверов по всему миру"
    },
    "index.title": {
      description: "Заголовок главной страницы",
      defaultMessage: "Надежная IT-инфраструктура для разнообразия решений"
    }
  },
  "en-US": {
    "index.title": {
      description: "Заголовок главной страницы",
      defaultMessage: "Reliable IT infrastructure for a variety of solutions"
    }
  },
  "ru-RU": {
    "index.title": {
      description: "Заголовок главной страницы",
      defaultMessage: "Надежная IT-инфраструктура для разнообразия решений"
    }
  }
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

describe("FileStorage", () => {
  it("read", async () => {
    const storage = new FileStorage("test/samples", "default", {
      read: async () => files,
      write: async data => {}
    });
    const actualSummary = await storage.read();

    expect(actualSummary).toMatchObject(summary);
  });

  it("write", async () => {
    let actualFiles: IFileData = {};

    const storage = new FileStorage("test/samples", "default", {
      read: async () => ({} as any),
      write: async data => {
        actualFiles = data;
      }
    });

    await storage.write(summary);

    expect(actualFiles).toMatchObject(files);
  });
});
