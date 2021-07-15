import {VfsDriver, AccessModes, FileNotFoundError, FileNoAccessError} from "@acte-de-presence/vfs";



export class VfsDriverMemory implements VfsDriver {
  private files: Record<string, Buffer> = {};

  public async exists(path: string): Promise<boolean> {
    return path in this.files;
  }


  public async access(path: string, mode: AccessModes) {
    switch(mode) {
      default: {
        return await this.exists(path);
      }
    }
  }

  public async read(path: string): Promise<Buffer> {
    if (await this.exists(path) === false) throw new FileNotFoundError(path);
    if (await this.access(path, AccessModes.R_OK) === false) throw new FileNoAccessError(path);

    return this.files[`${path}`];
  }

  public async write(path: string, data: Buffer): Promise<void> {
    this.files[`${path}`] = data;
  }

  public async delete(path: string): Promise<void> {
    delete this.files[`${path}`];
  }
}
