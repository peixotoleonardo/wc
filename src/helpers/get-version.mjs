import fs from 'node:fs/promises';

/**
 * @returns {Promise<string>}
 */
export const getVersion = async () => {
  const { version } = JSON.parse((await fs.readFile(new URL('../../package.json', import.meta.url))).toString());

  return version;
};
