
import { Option } from 'commander';

import { 
  countWords,
  POSITION_OF_QUANTITY_OF_WORDS,
} from '../core/count-words.mjs';

export class CountWordsOption {
  /**
   * @param {import('commander').program} program 
   */
  load(program) {
    program
      .addOption(new Option('-w, --words', 'get the word counts'))
      .action(this.handle.bind(this));
  }

  /**
   * @param {string[]} files 
   */
  async handle(files) {
    const result = await countWords(files);

    const maxLength = result.at(-1)[POSITION_OF_QUANTITY_OF_WORDS]
      .toString().split('').length;

    result.forEach(([file, quantityOfBytes]) => {
      console.log('%s %s', quantityOfBytes.toString().padStart(maxLength), file);
    });
  }
}