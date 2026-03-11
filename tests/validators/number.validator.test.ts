import { numberValidator } from "../../src/validators/number.validator";

describe("numberValidator", () => {
  it("parses a valid integer", () => {
    expect(numberValidator("3000", "PORT")).toBe(3000);
  });

  it("parses a valid float", () => {
    expect(numberValidator("3.14", "PI")).toBeCloseTo(3.14);
  });

  it("parses a negative number", () => {
    expect(numberValidator("-5", "OFFSET")).toBe(-5);
  });

  it("parses zero", () => {
    expect(numberValidator("0", "TIMEOUT")).toBe(0);
  });

  it("throws when the value is not a number", () => {
    expect(() => numberValidator("abc", "PORT")).toThrow(
      "PORT must be a number",
    );
  });

  it("throws on a mixed alphanumeric string", () => {
    expect(() => numberValidator("123abc", "PORT")).toThrow(
      "PORT must be a number",
    );
  });

  it("includes the env key name in the error message", () => {
    expect(() => numberValidator("bad", "MY_PORT")).toThrow(
      "MY_PORT must be a number",
    );
  });
});
