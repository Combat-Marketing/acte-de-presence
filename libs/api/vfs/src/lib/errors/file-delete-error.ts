export class FileDeleteError extends Error {
  constructor(path: string) {
    super(`Could not delete file: ${path}`);
  }
}
