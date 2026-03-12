import { booleanValidator } from "../../src/validators/boolean.validator";

describe("booleanValidator", () => {
  it("returns true for the string 'true'", () => {
    expect(booleanValidator("true", "FEATURE_FLAG")).toBe(true);
  });

  it("returns false for the string 'false'", () => {
    expect(booleanValidator("false", "FEATURE_FLAG")).toBe(false);
  });

  it("throws for '1'", () => {
    expect(() => booleanValidator("1", "FEATURE_FLAG")).toThrow(
      "FEATURE_FLAG must be a boolean",
    );
  });

  it("throws for '0'", () => {
    expect(() => booleanValidator("0", "FEATURE_FLAG")).toThrow(
      "FEATURE_FLAG must be a boolean",
    );
  });

  it("is case-sensitive — throws for 'True'", () => {
    expect(() => booleanValidator("True", "FEATURE_FLAG")).toThrow(
      "FEATURE_FLAG must be a boolean",
    );
  });

  it("is case-sensitive — throws for 'TRUE'", () => {
    expect(() => booleanValidator("TRUE", "FEATURE_FLAG")).toThrow(
      "FEATURE_FLAG must be a boolean",
    );
  });

  it("throws for 'yes'", () => {
    expect(() => booleanValidator("yes", "FEATURE_FLAG")).toThrow(
      "FEATURE_FLAG must be a boolean",
    );
  });

  it("includes the env key name in the error message", () => {
    expect(() => booleanValidator("bad", "MY_FLAG")).toThrow(
      "MY_FLAG must be a boolean",
    );
  });
});
