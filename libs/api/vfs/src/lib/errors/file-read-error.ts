export class FileReadError extends Error {
  constructor(filename: string) {
    super(`Error reading file: ${filename}`);
  }
}
