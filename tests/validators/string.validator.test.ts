import { stringValidator } from "../../src/validators/string.validator";

describe("stringValidator", () => {
  it("returns the raw value as-is", () => {
    expect(stringValidator("hello")).toBe("hello");
  });

  it("returns a numeric string without converting it", () => {
    expect(stringValidator("42")).toBe("42");
  });

  it("returns an empty string unchanged", () => {
    expect(stringValidator("")).toBe("");
  });

  it("returns a string with spaces", () => {
    expect(stringValidator("hello world")).toBe("hello world");
  });

  it("returns special characters unchanged", () => {
    expect(stringValidator("foo@bar.com")).toBe("foo@bar.com");
  });
});
