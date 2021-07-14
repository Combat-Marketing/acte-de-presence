import { FileWriteError } from './file-write-error';

describe('FileWriteError', () => {
  it('should display the correct message', () => {
    const err = new FileWriteError("test");
    expect(err.message).toBe("Could not write to file: test");
  });
});
