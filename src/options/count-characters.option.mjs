
import { Option } from 'commander';

import { POSITION_OF_QUANTITY_OF_CHARACTERS, countCharacters } from '../core/count-characters.mjs';

export class CountCharactersOption {
  /**
   * @param {import('commander').program} program 
   */
  load(program) {
    program
      .addOption(new Option('-m, --chars', 'get the character counts'))
      .action(this.handle.bind(this));
  }

  /**
   * @param {string[]} files 
   */
  async handle(files) {
    const result = await countCharacters(files);

    const maxLength = result.at(-1)[POSITION_OF_QUANTITY_OF_CHARACTERS]
      .toString().split('').length;

    result.forEach(([file, quantityOfBytes]) => {
      console.log('%s %s', quantityOfBytes.toString().padStart(maxLength), file);
    });
  }
}