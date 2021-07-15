# In-memory filesystem driver for the Acte de Présence VFS

## Usage

```Typescript
import {VFS} from '@acte-de-presence/vfs';

const vfs = new VFS();
vfs.use(new VfsMemoryDriver());

await vfs.write("/test", Buffer.from("TEST"));
```

## Running unit tests

Run `nx test vfs-driver-memory` to execute the unit tests via [Jest](https://jestjs.io).
