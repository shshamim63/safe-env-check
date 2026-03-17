import { parseValue } from "../../src/validators";

describe("parseValue", () => {
  it("delegates to stringValidator for type 'string'", () => {
    const rule = { type: "string" as const };
    expect(parseValue(rule, "hello", "VAR")).toBe("hello");
  });

  it("delegates to numberValidator for type 'number'", () => {
    const rule = { type: "number" as const };
    expect(parseValue(rule, "42", "PORT")).toBe(42);
  });

  it("delegates to booleanValidator for type 'boolean'", () => {
    const rule = { type: "boolean" as const };
    expect(parseValue(rule, "true", "FLAG")).toBe(true);
  });

  it("delegates to enumValidator for type 'enum'", () => {
    const rule = { type: "enum" as const, values: ["a", "b"] };
    expect(parseValue(rule, "a", "MODE")).toBe("a");
  });

  it("throws for an unsupported type", () => {
    const rule = { type: "unknown" as any };
    expect(() => parseValue(rule, "val", "VAR")).toThrow(
      "Unsupported type for VAR",
    );
  });

  it("propagates number validation errors", () => {
    const rule = { type: "number" as const };
    expect(() => parseValue(rule, "abc", "PORT")).toThrow(
      "PORT must be a number",
    );
  });

  it("propagates boolean validation errors", () => {
    const rule = { type: "boolean" as const };
    expect(() => parseValue(rule, "yes", "FLAG")).toThrow(
      "FLAG must be a boolean",
    );
  });

  it("propagates enum validation errors", () => {
    const rule = { type: "enum" as const, values: ["x", "y"] };
    expect(() => parseValue(rule, "z", "MODE")).toThrow(
      "MODE must be one of: x, y",
    );
  });
});
