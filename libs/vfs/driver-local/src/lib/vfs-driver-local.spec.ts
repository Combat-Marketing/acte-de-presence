
import { AccessModes, FileDeleteError, FileNoAccessError, FileNotFoundError, FileReadError, FileWriteError } from '@acte-de-presence/vfs';
import { constants } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

import { VfsDriverLocal } from './vfs-driver-local';
const driver = new VfsDriverLocal("/");
const testPath = path.join("/", "test");
const testPath2 = path.join("/", "test2");
const testData = Buffer.from("test");

describe('VfsDriverLocal', () => {
  it('should be able to check if a file exists', async () => {
    const accessSpy = jest.spyOn(fs, 'access').mockImplementation(async (path: string, mode: number) => {
      if (mode !== constants.F_OK || path !== testPath) {
        throw Error("File not found");
      }
    });
    expect(await driver.exists("test")).toBe(true);
    expect(await driver.exists("test2")).toBe(false);

    accessSpy.mockRestore();
  });

  it('should be able to check file access modes', async () => {
    const aSpy = jest.spyOn(fs, 'access').mockImplementation(async (path, mode) => {
      if (path !== testPath) {
        throw new Error("File access error");
      }
    });

    expect(await driver.access("test", AccessModes.F_OK)).toBe(true);
    expect(fs.access).toHaveBeenCalledWith(testPath, constants.F_OK);

    expect(await driver.access("test", AccessModes.R_OK)).toBe(true);
    expect(fs.access).toHaveBeenCalledWith(testPath, constants.R_OK);

    expect(await driver.access("test", AccessModes.W_OK)).toBe(true);
    expect(fs.access).toHaveBeenCalledWith(testPath, constants.W_OK);

    expect(await driver.access("test2", AccessModes.F_OK)).toBe(false);
    expect(fs.access).toHaveBeenCalledWith(testPath2, constants.F_OK);

    expect(await driver.access("test2", AccessModes.R_OK)).toBe(false);
    expect(fs.access).toHaveBeenCalledWith(testPath2, constants.R_OK);

    expect(await driver.access("test2", AccessModes.W_OK)).toBe(false);
    expect(fs.access).toHaveBeenCalledWith(testPath2, constants.W_OK);
  });

  it('should be able to write a file', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementation(async () => { return; });

    await driver.write(testPath, testData);

    expect(fs.writeFile).toHaveBeenCalledWith(testPath, testData);
  });

  it('should be able to handle a write failure', async () => {
    jest.spyOn(fs, 'writeFile').mockImplementation(async () => { throw new Error("Write fail"); });
    await expect(driver.write(testPath, testData)).rejects.toThrowError(FileWriteError);
  });

  it('should be able to read a file', async () => {
    jest.spyOn(fs, 'access').mockImplementation(async () => { return; });
    jest.spyOn(fs, 'readFile').mockImplementation(async () => { return testData; });
    await expect(driver.read(testPath)).resolves.toEqual(testData);
  });

  it('should be able to handle a read error', async () => {
    jest.spyOn(fs, 'access').mockImplementation(async () => { return; });
    jest.spyOn(fs, 'readFile').mockImplementation(async() => { throw new Error("Read error"); });

    await expect(driver.read(testPath)).rejects.toThrowError(FileReadError);
  });

  it('should be able to delete a file', async () => {
    jest.spyOn(fs, 'access').mockImplementation(async () => { return });
    jest.spyOn(fs, 'unlink').mockImplementation(async () => { return; });

    await driver.delete(testPath);

    expect(fs.unlink).toHaveBeenCalledWith(testPath);
  });

  it('should be able to handle a deletion error', async () => {
    jest.spyOn(fs, 'access').mockImplementation(async () =>  { return; });
    jest.spyOn(fs, 'unlink').mockImplementation(async () => { throw new Error("Delete error"); });

    await expect(driver.delete(testPath)).rejects.toThrowError(FileDeleteError);
  })

  it('should throw an error if the file is not found', async () => {
    jest.spyOn(fs, 'access').mockImplementation(async (path, mode) => {
      if (mode === constants.F_OK) {
        throw new Error("File not found");
      }
    });

    await expect(driver.read(testPath)).rejects.toThrowError(FileNotFoundError);
    await expect(driver.delete(testPath)).rejects.toThrowError(FileNotFoundError);
  });

  it('should throw an error if the file can not be accessed', async () => {
    jest.spyOn(fs, 'access').mockImplementation(async (path, mode) => {
      if (mode === constants.R_OK || mode === constants.W_OK) {
        throw new Error("Not able to access file");
      }
    });

    await expect(driver.read(testPath)).rejects.toThrowError(FileNoAccessError);
    await expect(driver.write(testPath, testData)).rejects.toThrowError(FileNoAccessError);
    await expect(driver.delete(testPath)).rejects.toThrowError(FileNoAccessError);
  });
});
