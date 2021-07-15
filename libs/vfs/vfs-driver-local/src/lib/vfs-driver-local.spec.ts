import { vfsDriverLocal } from './vfs-driver-local';

describe('vfsDriverLocal', () => {
  it('should work', () => {
    expect(vfsDriverLocal()).toEqual('vfs-driver-local');
  });
});
