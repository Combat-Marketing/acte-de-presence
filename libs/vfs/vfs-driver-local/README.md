# VFS Local filesystem driver

Local filesystem driver for the Acte de Présence Framework VFS
## Usage

```Typescript
import {VFS, AccessModes} from '@acte-de-presence/vfs';
import {VfsDriverLocal} from '@acte-de-presence/vfs-driver-local';

const vfs = new VFS();
vfs.use(new VfsDriverLocal("/"));

async function example() {
  try {
    await vfs.exists("test_file.txt");
    await vfs.access("test_file.txt", AccessModes.F_OK);
    await vfs.access("test_file.txt", AccessModes.R_OK);
    await vfs.access("test_file.txt", AccessModes.W_OK);
    await vfs.read("test_file.txt");
    await vfs.write("test_file.txt", Buffer.from("TEST"));
    await vfs.delete("test_file.txt");
  } catch(error) {
    console.error(error);
  }
}


## Running unit tests

Run `nx test vfs-vfs-driver-local` to execute the unit tests via [Jest](https://jestjs.io).
