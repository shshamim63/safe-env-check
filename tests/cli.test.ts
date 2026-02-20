import path from "path";

/**
 * Mock validateEnv
 */
const mockValidateEnv = jest.fn();

jest.mock("../src/validateEnv", () => ({
  validateEnv: mockValidateEnv,
}));

/**
 * Mock fs
 */
jest.mock("fs", () => ({
  existsSync: jest.fn(),
}));

/**
 * Mock dotenv
 */
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

/**
 * Mock package.json version
 */
jest.mock("../package.json", () => ({
  version: "1.0.0",
}));

describe("CLI", () => {
  const originalArgv = process.argv;
  const originalEnv = process.env;

  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();

    process.argv = ["node", "cli.ts"];
    process.env = { ...originalEnv };

    exitSpy = jest.spyOn(process, "exit").mockImplementation((() => {
      throw new Error("process.exit");
    }) as never);

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("prints help when --help is passed", () => {
    process.argv = ["node", "cli.ts", "--help"];

    expect(() => require("../src/cli")).toThrow("process.exit");

    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(logSpy).toHaveBeenCalled();
  });

  test("prints version when --version is passed", () => {
    process.argv = ["node", "cli.ts", "--version"];

    expect(() => require("../src/cli")).toThrow("process.exit");

    expect(logSpy).toHaveBeenCalledWith("1.0.0");
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test("fails when schema file is missing", () => {
    process.argv = ["node", "cli.ts"];

    expect(() => require("../src/cli")).toThrow("process.exit");

    expect(errorSpy).toHaveBeenCalledWith("❌ Schema file is required.\n");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("fails if schema file does not exist", () => {
    const fs = require("fs");
    fs.existsSync.mockReturnValue(false);

    process.argv = ["node", "cli.ts", "env.schema.js"];

    expect(() => require("../src/cli")).toThrow("process.exit");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test("calls validateEnv with correct options", () => {
    const fs = require("fs");
    fs.existsSync.mockReturnValue(true);

    const schemaPath = path.resolve(process.cwd(), "env.schema.js");

    jest.doMock(
      schemaPath,
      () => ({
        PORT: { type: "number", required: true },
      }),
      { virtual: true },
    );

    process.argv = [
      "node",
      "cli.ts",
      "env.schema.js",
      "--strict",
      "--format",
      "json",
    ];

    mockValidateEnv.mockImplementation(() => ({}));

    require("../src/cli");

    expect(mockValidateEnv).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        strict: true,
        formatError: expect.any(Function),
      }),
    );

    expect(logSpy).toHaveBeenCalledWith("✅ Environment variables are valid");
  });

  test("suppresses success message with --quiet", () => {
    const fs = require("fs");
    fs.existsSync.mockReturnValue(true);

    const schemaPath = path.resolve(process.cwd(), "env.schema.js");

    jest.doMock(schemaPath, () => ({}), { virtual: true });

    process.argv = ["node", "cli.ts", "env.schema.js", "--quiet"];

    mockValidateEnv.mockImplementation(() => ({}));

    require("../src/cli");

    expect(logSpy).not.toHaveBeenCalledWith(
      "✅ Environment variables are valid",
    );
  });

  test("prints formatted error when validateEnv throws", () => {
    const fs = require("fs");
    fs.existsSync.mockReturnValue(true);

    const schemaPath = path.resolve(process.cwd(), "env.schema.js");

    jest.doMock(schemaPath, () => ({}), { virtual: true });

    process.argv = ["node", "cli.ts", "env.schema.js", "--format", "json"];

    mockValidateEnv.mockImplementation(() => {
      throw new Error(JSON.stringify({ errors: ["PORT is required"] }));
    });

    expect(() => require("../src/cli")).toThrow("process.exit");

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
