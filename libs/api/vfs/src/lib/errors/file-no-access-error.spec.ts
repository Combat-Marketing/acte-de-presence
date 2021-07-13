import {FileNoAccessError} from './file-no-access-error';

describe('FileNoAccessError', () => {
  it('should display the correct filename', () => {
    const err = new FileNoAccessError("test.txt");
    expect(err.message).toBe("Not able to access file: test.txt");
  })
})
