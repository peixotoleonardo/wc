
import { Option } from 'commander';

import { 
  countBytes,
  POSITION_OF_QUANTITY_OF_BYTES,
} from '../core/count-bytes.mjs';

export class CountBytesOption {
  /**
   * @param {import('commander').program} program 
   */
  load(program) {
    program
      .addOption(new Option('-c, --bytes', 'get the byte counts'))
      .action(this.handle.bind(this));
  }

  /**
   * @param {string[]} files 
   */
  async handle(files) {
    const result = await countBytes(files);

    const maxLength = result.at(-1)[POSITION_OF_QUANTITY_OF_BYTES]
      .toString().split('').length;

    result.forEach(([file, quantityOfBytes]) => {
      console.log('%s %s', quantityOfBytes.toString().padStart(maxLength), file);
    });
  }
}