# Virtual Filesystem

This library is the Virtual filesystem used by the Acte de Présence framework

## Usage

```Typescript
import { VFS, AccessModes } from '@acte-de-presence/vfs';
import { VFSMemoryDriver } from '@acte-de-presence/vfs-memory-driver';

async function test() {
  const vfs = new VFS();
  vfs.use(new VFSMemoryDriver());

  const filename = "/test.txt";

  try {
    // Check if file exists
    await vfs.exists(filename) 

    // Check if file exists
    await vfs.access(filename, AccessModes.F_OK);

    // Check if file can be read
    await vfs.access(filename, AccessModes.R_OK);

    // Check if file can be written to
    await vfs.access(filename, AccessModes.W_OK);

    // Read the file
    await vfs.read(filename);

    // Write to an existing or new file
    await vfs.write(filename, Buffer.from("DATA"));

    // Delete a file
    await vfs.delete(filename);
  } catch (err) {
    console.error(err);
  }
}
```

## Driver specification

The drivers are meant to be extremely simple, and should only implement the following interface

```Typescript
interface VfsDriver {
  pathPrefix: string;
  exists: (path: string) => Promise<boolean>;
  access: (path: string, mode: AccessModes) => Promise<boolean>;
  write: (path: string, data: Buffer) => Promise<void>;
  read: (path: string) => Promise<Buffer>;
  delete: (path: string) => Promise<void>;
}
```

## Running unit tests

Run `nx test api-vfs` to execute the unit tests via [Jest](https://jestjs.io).
