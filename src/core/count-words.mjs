import fs from 'node:fs/promises';

export const POSITION_OF_QUANTITY_OF_WORDS = 1;

/**
  * @param {string[]} files
  * @returns {Promise<[string, number][]}
  */
export const countWords = async (files) => {
  const result = [];

  const tasks = files.map(async (file) => {
    result.push([file, ((await fs.readFile(file)).toString().trim().split(/\s+/)).length]);
  });
  await Promise.all(tasks);

  if (result.length > 1) {
    result.push(['total', result.reduce((total, [_, length]) => total + length, 0)]);
  }

  return result;
}