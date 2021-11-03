import { decode, encode } from './base64';

const b64 = "SGVsbG8sIFdvcmxkIQ==";
const str = "Hello, World!";

describe("base64", () => {
  it("should be able to encode a string into base64", () => {
    const output = encode(str);
    expect(output).toEqual(b64);
  });

  it("should be able to decode a string from base64", () => {
    const output = decode(b64);
    expect(output).toEqual(str);
  });
});
