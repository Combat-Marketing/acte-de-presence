import { access, readFile } from "fs/promises";
import * as fs from "fs";
import {FileNotFoundError, FileNoAccessError, FileReadError} from '@acte-de-presence/vfs';

const DEFAULT_BANNER = `Acte de Présence\n`;

/**
 * Prints a startup banner
 *
 * @param filename a file to load the banner from
 */
export async function apiBanner(filename?: string): Promise<void> {
  let banner = '';

  if (filename) {

    try {
      await access(filename, fs.constants.F_OK);
      } catch(err) {
      throw new FileNotFoundError(err);
    }

    try {
      await access(filename, fs.constants.R_OK);
    } catch(err) {
      throw new FileNoAccessError(filename);
    }

    try {
      const data = await readFile(filename);
      banner = data.toString();
    } catch(err) {
      throw new FileReadError(filename);
    }


  } else {
    banner = DEFAULT_BANNER;
  }
  output(banner)
}

function output(banner: string): void {
  process.stdout.write(banner);
  process.stdout.write("\n©2021 Combat Jongerenmarketing en -communicatie B.V. - All rights reserved.\n");
}
