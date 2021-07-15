import { AccessModes, FileNotFoundError } from '@acte-de-presence/vfs';
import { VfsDriverMemory } from './vfs-driver-memory';

const driver = new VfsDriverMemory();

const data1 = Buffer.from("TEST");
const data2 = Buffer.from("TEST2");

describe('VfsDriverMemory', () => {
  it('should be able to write and read a file', async () => {
    await driver.write("/test", data1);

    expect(await driver.read("/test")).toEqual(data1);
  });

  it('should be able to overwrite a faile and read the data', async () => {
    await driver.write("/test", data1);
    await driver.write("/test", data2);

    expect(await driver.read("/test")).toEqual(data2);
  });

  it("should be able to check if a file exists", async () => {
    await driver.write("/test", data1);

    expect(await driver.exists("/test")).toBe(true);
    expect(await driver.exists("/test2")).toBe(false);
  });

  it("should be able to check access", async () => {
    await driver.write("/test", data1);

    expect(await driver.access("/test", AccessModes.F_OK)).toBe(true);
    expect(await driver.access("/test2", AccessModes.F_OK)).toBe(false);
    expect(await driver.access("/test", AccessModes.R_OK)).toBe(true);
    expect(await driver.access("/test2", AccessModes.R_OK)).toBe(false);
    expect(await driver.access("/test", AccessModes.W_OK)).toBe(true);
    expect(await driver.access("/test2", AccessModes.W_OK)).toBe(false);
  });

  it('should throw an error if the file read does not exist', async () => {
    await expect(driver.read("/no-exist")).rejects.toThrowError(FileNotFoundError);
  })
});
