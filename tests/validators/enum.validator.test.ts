import { enumValidator } from "../../src/validators/enum.validator";
import { EnvRule } from "../../src/types";

describe("enumValidator", () => {
  const rule: EnvRule<"enum"> = {
    type: "enum",
    values: ["dev", "prod", "staging"],
  };

  it("returns a valid enum value", () => {
    expect(enumValidator(rule, "prod", "NODE_ENV")).toBe("prod");
  });

  it("returns another valid enum value", () => {
    expect(enumValidator(rule, "dev", "NODE_ENV")).toBe("dev");
  });

  it("throws when the value is not in the allowed list", () => {
    expect(() => enumValidator(rule, "test", "NODE_ENV")).toThrow(
      "NODE_ENV must be one of: dev, prod, staging",
    );
  });

  it("is case-sensitive when matching values", () => {
    expect(() => enumValidator(rule, "DEV", "NODE_ENV")).toThrow(
      "NODE_ENV must be one of: dev, prod, staging",
    );
  });

  it("includes all allowed values in the error message", () => {
    expect(() => enumValidator(rule, "unknown", "NODE_ENV")).toThrow(
      "dev, prod, staging",
    );
  });

  it("includes the env key name in the error message", () => {
    expect(() => enumValidator(rule, "bad", "MY_ENV")).toThrow(
      "MY_ENV must be one of:",
    );
  });

  it("works with a single-value enum", () => {
    const singleRule: EnvRule<"enum"> = { type: "enum", values: ["only"] };
    expect(enumValidator(singleRule, "only", "MODE")).toBe("only");
    expect(() => enumValidator(singleRule, "other", "MODE")).toThrow(
      "MODE must be one of: only",
    );
  });
});
