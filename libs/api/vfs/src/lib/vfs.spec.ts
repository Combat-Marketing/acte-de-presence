import { AccessModes } from './access-modes';
import { FileNoAccessError, FileReadError } from './errors';
import { VFS } from './vfs';
import { VfsDriver } from './vfs-driver-interface';

let vfs = new VFS()

const tData = Buffer.from("TEST");
class MockVfs implements VfsDriver {
  exists = jest.fn();
  access = jest.fn();
  write = jest.fn();
  read = jest.fn();
  delete = jest.fn();
}

const mockVfs = new MockVfs();
const mockVfs2 = new MockVfs();

describe('VFS', () => {
  beforeEach(() => {
    vfs = new VFS();
    vfs
    .use(mockVfs)
    .use(mockVfs2, 100);
  });

  it ('should be able to check if a file exists', async () => {
    const spy1 = jest.spyOn(mockVfs, 'exists').mockResolvedValue(true);
    const spy2 = jest.spyOn(mockVfs2, 'exists').mockResolvedValue(true);

    await vfs.exists('/exists');
    expect(mockVfs.exists).not.toHaveBeenCalled();
    expect(mockVfs2.exists).toHaveBeenCalled();

    spy1.mockReset();
    spy2.mockReset();
    spy1.mockReturnValue(true);
    spy2.mockImplementation(async (path: string) => {
      if (path === "/impl-1") { return false; }
    });

    expect(await vfs.exists("/impl-1")).toBe(true);
    expect(mockVfs.exists).toHaveBeenCalled();
    spy1.mockReset();
    spy2.mockReset();
  });

  it ('should be able to check access modes on files', async () => {
    const spy = jest.spyOn(mockVfs2, 'access').mockResolvedValue(true);
    expect(await vfs.access("/exists", AccessModes.F_OK)).toBe(true);
    expect(await vfs.access("/exists", AccessModes.R_OK)).toBe(true);
    expect(await vfs.access("/exists", AccessModes.W_OK)).toBe(true);
    spy.mockReset();

    spy.mockResolvedValue(false);
    expect(await vfs.access("/error", AccessModes.F_OK)).toBe(false);
    expect(await vfs.access("/error", AccessModes.R_OK)).toBe(false);
    expect(await vfs.access("/error", AccessModes.W_OK)).toBe(false);
  });

  it('should be able to read data', async () => {
    jest.spyOn(mockVfs, 'read').mockResolvedValue(tData);
    jest.spyOn(mockVfs, 'exists').mockResolvedValue(false);
    jest.spyOn(mockVfs2, 'read').mockResolvedValue(tData);
    jest.spyOn(mockVfs2, 'exists').mockResolvedValue(true);
    expect(await vfs.read("/exists")).toEqual(tData);

  });

  it('should be able to write data', async () => {
    const data = Buffer.from("WRITE");

    jest.spyOn(mockVfs2, 'write').mockImplementation(async (path: string) => {
      if (path === "/error") throw new FileNoAccessError(path);
      return;
    });


    await vfs.write("/written", data);
    expect(mockVfs2.write).toHaveBeenCalled();
  });

  it('should be able to delete a file', async () => {
    jest.spyOn(mockVfs2, 'delete').mockImplementation(async () => { return; });
    await vfs.delete("/test");
    expect(mockVfs2.delete).toHaveBeenCalledWith("/test");
  })

  it('should be able to handle a read error', async () => {
    jest.spyOn(mockVfs2, 'read').mockImplementation(async (path) => { throw new FileReadError(path) });
    await expect(vfs.read("/error")).rejects.toThrowError(FileReadError);
  });

  it('should be able to handle write errors', async () => {
    jest.spyOn(mockVfs, 'write').mockImplementation(async (path) => { throw new FileNoAccessError(path) });
    jest.spyOn(mockVfs2, 'write').mockImplementation(async (path) => { throw new FileNoAccessError(path) });
    await expect(vfs.write("/error", Buffer.from("ERROR"))).rejects.toThrowError(FileNoAccessError);
  });

  it('should be able to handle write errors and write to an available vfs', async () => {
    jest.spyOn(mockVfs, 'write').mockImplementation(async () => { return; });
    jest.spyOn(mockVfs2, 'write').mockImplementation(async (path) => { throw new FileNoAccessError(path) });
    await vfs.write("/error", Buffer.from("ERROR"))
    expect(mockVfs.write).toHaveBeenCalled();
  });
});
