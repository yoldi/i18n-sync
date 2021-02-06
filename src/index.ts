import { OptionValues, program } from 'commander';
import { readFromSheet, writeToSheet } from './sheet/sync';
import { readLangDir } from './files/readLangDir';
import { fromCombinedMessages, toCombinedMessages } from './files/combined';
import { configFromFile, IConfig } from './config';

async function loadConfig(opts: OptionValues) {
  const config = await configFromFile(opts.config);
  return config;
}

// @ts-ignore
async function pull(config: IConfig) {
  const messages = await readFromSheet(config);
  const languages = fromCombinedMessages(messages, 'default');
  console.log(languages);
}

async function push(config: IConfig) {
  const languages = await readLangDir('./test/samples');
  const summary = await toCombinedMessages(languages, 'default');
  await writeToSheet(summary, config);
}

async function main() {
  program.option(
    '-c, --config <path>',
    'path to config file',
    'i18n-sync.json'
  );

  program
    .command('pull')
    .description('Fetch i18n from Google Sheets')
    .action(async () => {
      const config = await loadConfig(program.opts());
      await pull(config);
    });

  program
    .command('push')
    .description('Push i18n to Google Sheets')
    .action(push);

  await program.parseAsync(process.argv);
}

main();
