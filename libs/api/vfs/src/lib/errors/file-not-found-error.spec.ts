import { FileNotFoundError } from "./file-not-found-error"

describe("FileNotFOundError", () => {
  it("Should give the correct error message", () => {
    const err = new FileNotFoundError("test.txt");
    expect(err.message).toBe("File not found: test.txt");
  });
});
