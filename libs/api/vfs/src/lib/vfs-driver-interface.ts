import { AccessModes } from "./access-modes";

export interface VfsDriver {
  exists: (path: string) => Promise<boolean>;
  access: (path: string, mode: AccessModes) => Promise<boolean>;
  write: (path: string, data: Buffer) => Promise<void>;
  read: (path: string) => Promise<Buffer>;
  delete: (path: string) => Promise<void>;
}
