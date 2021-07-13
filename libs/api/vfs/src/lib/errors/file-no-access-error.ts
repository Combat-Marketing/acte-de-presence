export class FileNoAccessError extends Error {
  constructor(filename: string) {
    super(`Not able to access file: ${filename}`);
  }
}
