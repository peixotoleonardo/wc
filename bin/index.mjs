#!/usr/bin/env node

import * as commander from 'commander';

import { getVersion } from '../src/helpers/get-version.mjs';

commander.program
  .version(
    await getVersion(),
    '-v, --version',
    'Get the current version',
  )
  .helpOption(
    '-h, --help',
    'Get help for command',
  );

await commander.program.parseAsync(process.argv);

if (!process.argv.slice(2).length) {
  commander.program.outputHelp();
}
