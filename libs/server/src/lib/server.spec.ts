import { Server } from './server';

describe('server', () => {
  it('should work', () => {
    const server = new Server();
    expect(server).toBeDefined();
  });
});
