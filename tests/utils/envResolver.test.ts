import { resolveEnvKey } from "../../src/utils/envResolver";

describe("resolveEnvKey", () => {
  it("returns the key unchanged when no prefix is given", () => {
    expect(resolveEnvKey("PORT")).toBe("PORT");
  });

  it("returns the key unchanged when prefix is undefined", () => {
    expect(resolveEnvKey("PORT", undefined)).toBe("PORT");
  });

  it("prepends the prefix to the key", () => {
    expect(resolveEnvKey("PORT", "APP_")).toBe("APP_PORT");
  });

  it("works with an empty prefix string", () => {
    expect(resolveEnvKey("PORT", "")).toBe("PORT");
  });

  it("preserves casing of both prefix and key", () => {
    expect(resolveEnvKey("DbHost", "MYAPP_")).toBe("MYAPP_DbHost");
  });
});
