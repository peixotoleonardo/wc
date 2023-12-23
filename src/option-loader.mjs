import { CountBytesOption } from './options/count-bytes.option.mjs';

export class OptionLoader {
  /**
   * @param {import('commander').program} program 
   */
  static load(program) {
    new CountBytesOption().load(program);
  }
}
