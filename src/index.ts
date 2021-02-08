import { program } from "commander";
import { ConfigMaker } from "./config/ConfigMaker";
import { I18nSync } from "./i18nSync";

async function main() {
  program.name("i18n-sync");

  program.option("-c, --config <path>", "path to config file", "i18n-sync.json");

  const getConfig = async () => {
    const configPath = program.opts().config;

    const configMaker = new ConfigMaker();
    await configMaker.loadFromFile(configPath);

    return configMaker.getConfig();
  };

  program
    .command("pull")
    .description("Fetch i18n from Google Sheets")
    .action(async () => {
      const config = await getConfig();
      await new I18nSync(config).pull();

      console.log("Pull completed successfully.");
    });

  program
    .command("push")
    .description("Push i18n to Google Sheets")
    .action(async () => {
      const config = await getConfig();
      await new I18nSync(config).push();
      console.log("Push completed successfully.");
    });

  await program.parseAsync(process.argv);
}

main();
