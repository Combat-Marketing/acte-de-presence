import * as path from 'path';
import * as fs from 'fs/promises';
import {constants as fsConstants} from 'fs';
import {VfsDriver, AccessModes, FileNoAccessError, FileNotFoundError, FileWriteError, FileReadError, FileDeleteError} from '@acte-de-presence/vfs';


export class VfsDriverLocal implements VfsDriver {

  constructor(private readonly fileSystemRoot: string) {
  }

  /**
   * @inheritdoc
   *
   * @param filePath
   * @returns
   */
  public async exists(filePath: string): Promise<boolean> {
    const resolvedPath = path.join(this.fileSystemRoot, filePath);
    try {
      await fs.access(resolvedPath, fsConstants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async access(filePath: string, mode: AccessModes): Promise<boolean> {
    const resolvedPath = path.join(this.fileSystemRoot, filePath);
    try {
      switch(mode) {
        case AccessModes.F_OK:
          await fs.access(resolvedPath, fsConstants.F_OK);
          break;
        case AccessModes.R_OK:
          await fs.access(resolvedPath, fsConstants.R_OK);
          break;
        case AccessModes.W_OK:
          await fs.access(resolvedPath, fsConstants.W_OK);
          break;
      }
      return true;
    } catch {
      return false
    }
  }

  async write(filePath: string, data: Buffer): Promise<void> {
    const resolvedPath = path.join(this.fileSystemRoot, filePath);

    if (await this.exists(resolvedPath) === true && await this.access(resolvedPath, AccessModes.W_OK) === false)
      throw new FileNoAccessError(resolvedPath)

    try {
      await fs.writeFile(resolvedPath, data);
    } catch(err) {
      throw new FileWriteError(resolvedPath);
    }
  }

  async read(filePath: string): Promise<Buffer> {
    const resolvedPath = path.join(this.fileSystemRoot, filePath);

    if (await this.exists(resolvedPath) === false) throw new FileNotFoundError(resolvedPath);
    if (await this.access(resolvedPath, AccessModes.R_OK) === false) throw new FileNoAccessError(resolvedPath);

    try {
      return await fs.readFile(resolvedPath);
    } catch (err) {
      throw new FileReadError(resolvedPath);
    }
  }

  async delete(filePath: string): Promise<void> {
    const resolvedPath = path.join(this.fileSystemRoot, filePath);
    if (await this.exists(resolvedPath) === false) throw new FileNotFoundError(resolvedPath);
    if (await this.access(resolvedPath, AccessModes.W_OK) === false) throw new FileNoAccessError(resolvedPath);

    try {
      await fs.rm(resolvedPath);
    } catch(err) {
      throw new FileDeleteError(resolvedPath);
    }
  }
}
