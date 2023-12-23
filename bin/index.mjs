#!/usr/bin/env node

import * as commander from 'commander';

import { OptionLoader } from '../src/option-loader.mjs';
import { getVersion } from '../src/helpers/get-version.mjs';

commander.program
  .version(await getVersion(), '-v, --version', 'Get the current version')
  .usage('<option> <files...>')
  .argument('<files...>')
  .helpOption('-h, --help', 'Get help for command');

OptionLoader.load(commander.program);

await commander.program.parseAsync(process.argv);

if (!process.argv.slice(2).length) {
  commander.program.outputHelp();
}
