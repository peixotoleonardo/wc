
import { Option } from 'commander';

import { 
  countLines,
  POSITION_OF_QUANTITY_OF_LINES,
} from '../core/count-lines.mjs';

export class CountLinesOption {
  /**
   * @param {import('commander').program} program 
   */
  load(program) {
    program
      .addOption(new Option('-l, --lines', 'get the newline counts'))
      .action(this.handle.bind(this));
  }

  /**
   * @param {string[]} files 
   */
  async handle(files) {
    const result = await countLines(files);

    const maxLength = result.at(-1)[POSITION_OF_QUANTITY_OF_LINES]
      .toString().split('').length;

    result.forEach(([file, quantityOfBytes]) => {
      console.log('%s %s', quantityOfBytes.toString().padStart(maxLength), file);
    });
  }
}