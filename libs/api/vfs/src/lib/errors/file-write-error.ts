export class FileWriteError extends Error {
  constructor(path: string) {
    super(`Could not write to file: ${path}`);
  }
}
