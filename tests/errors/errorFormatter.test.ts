import { defaultErrorFormatter } from "../../src/errors/errorFormatter";

describe("defaultErrorFormatter", () => {
  test("formats a single error", () => {
    const result = defaultErrorFormatter(["PORT is required"]);
    expect(result).toBe(
      "❌ Environment validation failed:\n- PORT is required",
    );
  });

  test("formats multiple errors", () => {
    const result = defaultErrorFormatter([
      "PORT is required",
      "HOST must be a number",
    ]);
    expect(result).toBe(
      "❌ Environment validation failed:\n- PORT is required\n- HOST must be a number",
    );
  });

  test("formats an empty errors array", () => {
    const result = defaultErrorFormatter([]);
    expect(result).toBe("❌ Environment validation failed:\n");
  });

  test("prefixes each error with a dash", () => {
    const result = defaultErrorFormatter(["A", "B", "C"]);
    const lines = result.split("\n").slice(1);
    expect(lines).toEqual(["- A", "- B", "- C"]);
  });
});
