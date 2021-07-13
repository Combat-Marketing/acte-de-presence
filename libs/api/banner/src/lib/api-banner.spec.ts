import { constants } from 'fs';
import * as fs from 'fs/promises';

import { apiBanner } from './api-banner';
import { FileNoAccessError } from './file-no-access-error';
import { FileNotFoundError } from './file-not-found-error';
import { FileReadError } from './file-read-error';

describe('apiBanner', () => {
  beforeEach(() => {
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

  });
  afterEach(() => {
    jest.spyOn(process.stdout, 'write').mockClear();
  });

  it('should output a default banner without filename', async () => {
    await apiBanner();
    expect(process.stdout.write).toBeCalledTimes(2);
    expect(process.stdout.write).toBeCalledWith("Acte de Présence\n");
  });

  it('should be able to read a file and show the banner', async () => {
    const accessSpy = jest.spyOn(fs, 'access').mockImplementation(async () => { return; });
    const readFileSpy = jest.spyOn(fs, 'readFile').mockImplementation(async() => { return Buffer.from("TEST\n"); });
    await apiBanner('./test-banner.txt');

    expect(process.stdout.write).toBeCalledTimes(2);
    expect(process.stdout.write).toBeCalledWith("TEST\n");

    readFileSpy.mockRestore();
    accessSpy.mockRestore();
  });


  it('should throw an error if the file does not exist', async () => {
    const accessSpy = jest.spyOn(fs, 'access').mockImplementation(async () => { throw new Error("TEST") });
    await expect(apiBanner("test.txt")).rejects.toThrowError(FileNotFoundError);
    accessSpy.mockRestore();
  });

  it('should throw an error if the file exists but cant be read', async () => {
    const accessSpy = jest.spyOn(fs, 'access').mockImplementation(async (path: string, mode: number) => {
      if (mode === constants.R_OK) {
        throw new Error("Can't read file");
      }
    });
    await expect(apiBanner("test.txt")).rejects.toThrowError(FileNoAccessError);
    accessSpy.mockRestore();
  });

  it('should throw an error when there was an error reading the file', async () => {
    const accessSpy = jest.spyOn(fs, 'access').mockImplementation(async () => { return; });
    const readFileSpy = jest.spyOn(fs, 'readFile').mockImplementation(async (path) => {
      throw new FileReadError(path.toString());
    });

    await expect(apiBanner("test.txt")).rejects.toThrowError(FileReadError);

    accessSpy.mockRestore();
    readFileSpy.mockRestore();
  })
});
