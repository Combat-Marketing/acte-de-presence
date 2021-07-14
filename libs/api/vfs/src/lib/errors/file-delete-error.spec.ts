import {FileDeleteError} from './file-delete-error';

describe('FileDeleteError', () => {
  it('should display the correct message', () => {
    const err = new FileDeleteError("test");
    expect(err.message).toBe('Could not delete file: test');
  })
})
