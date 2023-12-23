#!/usr/bin/env node

import * as commander from 'commander';

import { CommandLoader } from '../src/command-loader.mjs';
import { getVersion } from '../src/helpers/get-version.mjs';

commander.program
  .version(await getVersion(), '-v, --version', 'Get the current version')
  .usage('<option> <file>')
  .argument('[file]')
  .helpOption('-h, --help', 'Get help for command');

CommandLoader.load(commander.program);

await commander.program.parseAsync(process.argv);

if (!process.argv.slice(2).length) {
  commander.program.outputHelp();
}
