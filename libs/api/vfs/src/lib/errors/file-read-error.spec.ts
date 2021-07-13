import {FileReadError} from './file-read-error';

describe('FileReadError', () => {
  it("Should give the correct error message", () => {
    const err = new FileReadError("test.txt");
    expect(err.message).toBe("File not found: test.txt");
  });
});
