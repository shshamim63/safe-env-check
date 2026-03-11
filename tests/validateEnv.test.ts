import { validateEnv } from "../src/validateEnv";

describe("validateEnv", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ─── Type parsing ───────────────────────────────────────────────────────────

  it("parses a required string variable", () => {
    process.env.HOST = "localhost";
    const env = validateEnv({ HOST: { type: "string", required: true } }, {});
    expect(env.HOST).toBe("localhost");
  });

  it("parses a required number variable", () => {
    process.env.PORT = "3000";
    const env = validateEnv({ PORT: { type: "number", required: true } }, {});
    expect(env.PORT).toBe(3000);
  });

  it("parses a boolean 'true'", () => {
    process.env.DEBUG = "true";
    const env = validateEnv({ DEBUG: { type: "boolean" } }, {});
    expect(env.DEBUG).toBe(true);
  });

  it("parses a boolean 'false'", () => {
    process.env.DEBUG = "false";
    const env = validateEnv({ DEBUG: { type: "boolean" } }, {});
    expect(env.DEBUG).toBe(false);
  });

  it("parses a valid enum value", () => {
    process.env.NODE_ENV = "prod";
    const env = validateEnv(
      { NODE_ENV: { type: "enum", values: ["dev", "prod"] } },
      {},
    );
    expect(env.NODE_ENV).toBe("prod");
  });

  // ─── Required / default ─────────────────────────────────────────────────────

  it("throws when a required variable is missing", () => {
    expect(() =>
      validateEnv({ JWT_SECRET: { type: "string", required: true } }, {}),
    ).toThrow("JWT_SECRET is required");
  });

  it("uses the default value when the variable is not set", () => {
    const env = validateEnv(
      { NODE_ENV: { type: "string", default: "development" } },
      {},
    );
    expect(env.NODE_ENV).toBe("development");
  });

  it("prefers the env value over the default", () => {
    process.env.NODE_ENV = "production";
    const env = validateEnv(
      { NODE_ENV: { type: "string", default: "development" } },
      {},
    );
    expect(env.NODE_ENV).toBe("production");
  });

  it("returns undefined for optional variable with no default and no value", () => {
    const env = validateEnv({ OPTIONAL: { type: "string" } }, {});
    expect(env.OPTIONAL).toBeUndefined();
  });

  // ─── Prefix ─────────────────────────────────────────────────────────────────

  it("resolves env keys using a prefix", () => {
    process.env.APP_PORT = "8080";
    const env = validateEnv(
      { PORT: { type: "number", required: true } },
      { prefix: "APP_" },
    );
    expect(env.PORT).toBe(8080);
  });

  it("includes the prefix in the error message for a missing required variable", () => {
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { prefix: "APP_" },
      ),
    ).toThrow("APP_PORT is required");
  });

  // ─── Strict mode ────────────────────────────────────────────────────────────

  it("does not throw in strict mode when all env keys match the schema", () => {
    process.env.PORT = "3000";
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { strict: true },
      ),
    ).not.toThrow();
  });

  it("throws in strict mode when an unknown env variable is present", () => {
    process.env.PORT = "3000";
    process.env.UNKNOWN = "oops";
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { strict: true },
      ),
    ).toThrow("Unknown env veriables: UNKNOWN");
  });

  it("ignores non-prefixed variables in strict+prefix mode", () => {
    process.env.APP_PORT = "3000";
    process.env.OTHER_VAR = "ignored";
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { strict: true, prefix: "APP_" },
      ),
    ).not.toThrow();
  });

  it("throws in strict+prefix mode when an unknown prefixed variable exists", () => {
    process.env.APP_PORT = "3000";
    process.env.APP_UNKNOWN = "bad";
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { strict: true, prefix: "APP_" },
      ),
    ).toThrow("Unknown env veriables: APP_UNKNOWN");
  });

  // ─── Error collection ────────────────────────────────────────────────────────

  it("collects multiple validation errors before throwing", () => {
    let message = "";
    try {
      validateEnv(
        {
          PORT: { type: "number", required: true },
          HOST: { type: "string", required: true },
        },
        {},
      );
    } catch (e: any) {
      message = e.message;
    }
    expect(message).toContain("PORT is required");
    expect(message).toContain("HOST is required");
  });

  it("uses the default error formatter when no formatError is provided", () => {
    expect(() =>
      validateEnv({ PORT: { type: "number", required: true } }, {}),
    ).toThrow("❌ Environment validation failed:");
  });

  it("uses a custom formatError when provided", () => {
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { formatError: (errs) => "CUSTOM: " + errs.join("|") },
      ),
    ).toThrow("CUSTOM: PORT is required");
  });

  // ─── Quiet mode ──────────────────────────────────────────────────────────────

  it("does not throw when quiet is true, even with validation errors", () => {
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { quiet: true },
      ),
    ).not.toThrow();
  });

  // ─── Type validation errors ───────────────────────────────────────────────────

  it("throws when a number variable has a non-numeric value", () => {
    process.env.PORT = "abc";
    expect(() =>
      validateEnv({ PORT: { type: "number", required: true } }, {}),
    ).toThrow("PORT must be a number");
  });

  it("throws when a boolean variable has an invalid value", () => {
    process.env.FLAG = "yes";
    expect(() =>
      validateEnv({ FLAG: { type: "boolean", required: true } }, {}),
    ).toThrow("FLAG must be a boolean");
  });

  it("throws when an enum variable has a value outside the allowed list", () => {
    process.env.MODE = "unknown";
    expect(() =>
      validateEnv(
        { MODE: { type: "enum", values: ["dev", "prod"], required: true } },
        {},
      ),
    ).toThrow("MODE must be one of: dev, prod");
  });
});
