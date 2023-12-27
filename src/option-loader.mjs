import { CountBytesOption } from './options/count-bytes.option.mjs';
import { CountCharactersOption } from './options/count-characters.option.mjs';
import { CountLinesOption } from './options/count-lines.option.mjs';
import { CountWordsOption } from './options/count-words.option.mjs';

export class OptionLoader {
  /**
   * @param {import('commander').program} program 
   */
  static load(program) {
    new CountBytesOption().load(program);
    new CountLinesOption().load(program);
    new CountWordsOption().load(program);
    new CountCharactersOption().load(program);
  }
}
