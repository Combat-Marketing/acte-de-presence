import { AccessModes } from "./access-modes";

export interface VfsDriver {
  /**
   * Check if a file exists
   *
   * @param path the path to the file
   * @returns
   */
  exists(path: string): Promise<boolean>;

  /**
   * Checks access to the file (F_OK, R_OK, W_OK)
   *
   * @param path the file path
   * @param mode the access mode
   * @returns
   */
  access(path: string, mode: AccessModes): Promise<boolean>;

  /**
   * Write or overwrites a file with the given buffer
   *
   * @param path the filepath
   * @param data the data buffer to write
   */
  write(path: string, data: Buffer): Promise<void>;

  /**
   * Tries to read a file a the given path and return a buffer of data
   *
   * @param path the filepath
   * @returns
   */
  read(path: string): Promise<Buffer>;

  /**
   * Tries to delete a file at the given file path
   *
   * @param path the file path
   */
  delete(path: string): Promise<void>;
}
