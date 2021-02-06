import { program } from 'commander';

async function pull() {
  /* code goes here */
}

async function push() {
  /* code goes here */
}

async function main() {
  program.command('pull', 'Fetch i18n from Google Sheets').action(pull);

  program.command('push', 'Push i18n to Google Sheets').action(push);

  await program.parseAsync(process.argv);
}

main();
