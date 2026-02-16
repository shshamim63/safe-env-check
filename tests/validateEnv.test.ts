import { validateEnv } from "../src/validateEnv";

describe("validateEnv", () => {
  beforeEach(() => {
    process.env = {};
  });

  it("validates required number", () => {
    process.env.PORT = "3000";

    const env = validateEnv({
      PORT: { type: "number", required: true },
    });

    expect(env.PORT).toBe(3000);
  });

  it("throws on missing required", () => {
    expect(() =>
      validateEnv({
        JWT_SECRET: { type: "string", required: true },
      }),
    ).toThrow("JWT_SECRET is required");
  });

  it("supports default value", () => {
    const env = validateEnv({
      NODE_ENV: { type: "string", default: "development" },
    });

    expect(env.NODE_ENV).toBe("development");
  });

  it("supports enum", () => {
    process.env.MODE = "prod";

    const env = validateEnv({
      MODE: { type: "enum", values: ["dev", "prod"] },
    });

    expect(env.MODE).toBe("prod");
  });

  it("strict mode fails on unknown env", () => {
    process.env.UNKNOWN = "123";

    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { strict: true },
      ),
    ).toThrow("❌ Environment validation failed:");
  });

  it("custom error formatter", () => {
    expect(() =>
      validateEnv(
        { PORT: { type: "number", required: true } },
        { formatError: (errs) => "Custom: " + errs.join(",") },
      ),
    ).toThrow("Custom:");
  });
});
