import { AccessModes } from './access-modes';
import {
  FileDeleteError,
  FileNotFoundError,
  FileReadError,
  FileWriteError,
} from './errors';
import { VfsDriver } from './vfs-driver-interface';

export class VFS {
  private registeredDrivers: { priority: number; driver: VfsDriver }[] = [];
  private fileDriverCache: Record<string, number> = {};

  /**
   * Registers a VFS driver to use by the VFS system.
   *
   * @param driver The VFS driver to register
   * @param priority higher is higher priority
   */
  public use(driver: VfsDriver, priority = 0): this {
    this.registeredDrivers.push({
      priority,
      driver,
    });
    this.registeredDrivers.sort((a, b) => b.priority - a.priority);
    return this;
  }

  /**
   * Checks if a file exists in the given path
   *
   * @param path the file path
   * @returns
   */
  public async exists(path: string): Promise<boolean> {
    const cachedDriver = this.getCachedDriver(path);
    if (cachedDriver) {
      return await cachedDriver.exists(path);
    }

    for (const idx in this.registeredDrivers) {
      if (await this.registeredDrivers[idx].driver.exists(path)) {
        this.setCachedDriver(path, parseInt(idx));

        return true;
      }
    }

    return false;
  }

  /**
   * Cheack if the user has access to a certain file mode
   *
   * @param path the file path
   * @param mode the access mode to check
   * @returns
   */
  public async access(path: string, mode: AccessModes): Promise<boolean> {
    const cachedDriver = this.getCachedDriver(path);
    if (cachedDriver) {
      return await cachedDriver.access(path, mode);
    }

    for (const idx in this.registeredDrivers) {
      if (await this.registeredDrivers[idx].driver.access(path, mode)) {
        this.setCachedDriver(path, parseInt(idx));
        return true;
      }
    }

    return false;
  }

  /**
   * Tries to read data from the given path
   * @param path the filepath
   * @returns
   */
  public async read(path: string): Promise<Buffer> {
    if (await this.exists(path)) {
      const cachedDriver = this.getCachedDriver(path);

      if (cachedDriver) {
        return await cachedDriver.read(path);
      }
    }
    throw new FileReadError(path);
  }

  /**
   * Tries to write data to the first filesystem that will accept it
   *
   * @param path the filepath
   * @param data the data to write
   */
  public async write(path: string, data: Buffer) {
    const cachedDriver = this.getCachedDriver(path);
    if (cachedDriver) {
      await cachedDriver.write(path, data);
      return;
    }

    for (const idx in this.registeredDrivers) {
      try {
        await this.registeredDrivers[idx].driver.write(path, data);
        this.setCachedDriver(path, parseInt(idx));
        return;
      } catch (err) {
        // Keep the loop rolling
        continue;
      }
    }

    throw new FileWriteError(path);
  }

  public async delete(path: string): Promise<void> {
    if (await this.exists(path)) {
      const driver = this.getCachedDriver(path);
      try {
        await driver.delete(path);
      } catch (err) {
        throw new FileDeleteError(path);
      }
    } else {
      throw new FileNotFoundError(path);
    }
  }

  /**
   * Checks if the file location is cached
   *
   * @param path the file path
   */
  private getCachedDriver(path: string): VfsDriver | null {
    if (path in this.fileDriverCache) {
      const index = this.fileDriverCache[`${path}`];
      return this.registeredDrivers[index].driver;
    }
    return null;
  }

  private setCachedDriver(path: string, driverIndex: number): void {
    this.fileDriverCache[`${path}`] = driverIndex;
  }
}
