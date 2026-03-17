import { validateEnv } from "../../src/validateEnv/validateEnv";
import dotenv from "dotenv";
import { resolveEnvKey } from "../../src/utils/envResolver";
import { parseValue } from "../../src/validators";
import { checkUnknownKeys } from "../../src/validateEnv/checkUnknownKeys";
import { defaultErrorFormatter } from "../../src/errors/errorFormatter";
import { EnvSchema } from "../../src/types";

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

jest.mock("../../src/utils/envResolver", () => ({
  resolveEnvKey: jest.fn(),
}));
jest.mock("../../src/validators", () => ({
  parseValue: jest.fn(),
}));
jest.mock("../../src/validateEnv/checkUnknownKeys", () => ({
  checkUnknownKeys: jest.fn(),
}));
jest.mock("../../src/errors/errorFormatter", () => ({
  defaultErrorFormatter: jest.fn(),
}));

describe("validateEnv", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should return parsed env values", () => {
    const schema = {
      FOO: { type: "string", required: true },
      BAR: { type: "string", required: false, default: "defaultBar" },
    } as EnvSchema;

    (checkUnknownKeys as jest.Mock).mockReturnValue([
      "Unknown env variables: BAR",
    ]);
    (resolveEnvKey as jest.Mock).mockImplementation((key) => key);
    (parseValue as jest.Mock).mockImplementation((_, value) => value);

    (defaultErrorFormatter as jest.Mock).mockImplementation((errors) =>
      errors.join(", "),
    );

    process.env.FOO = "fooValue";

    const result = validateEnv(schema as any);

    expect(result).toEqual({ FOO: "fooValue", BAR: "defaultBar" });
    expect(dotenv.config).toHaveBeenCalledWith({ path: ".env" });
  });
  test("should throw an error if required env is missing", () => {
    const schema = {
      REQUIRED_VAR: { type: "string", required: true },
    } as EnvSchema;

    jest.spyOn(dotenv, "config").mockImplementation(() => ({ parsed: {} }));
    (checkUnknownKeys as jest.Mock).mockReturnValue([]);
    (resolveEnvKey as jest.Mock).mockImplementation((key) => key);

    (parseValue as jest.Mock).mockImplementation((_, value) => value);
    (defaultErrorFormatter as jest.Mock).mockImplementation((errors) =>
      errors.join(", "),
    );

    delete process.env.REQUIRED_VAR;

    expect(() => validateEnv(schema)).toThrow("REQUIRED_VAR is required");
  });
  test("should throw an error if required env is missing", () => {
    const schema = {
      REQUIRED_VAR: { type: "string", required: true },
    } as EnvSchema;

    jest.spyOn(dotenv, "config").mockImplementation(() => ({ parsed: {} }));
    (checkUnknownKeys as jest.Mock).mockReturnValue([]);
    (resolveEnvKey as jest.Mock).mockImplementation((key) => key);
    (parseValue as jest.Mock).mockImplementation((_, value) => value);
    (defaultErrorFormatter as jest.Mock).mockImplementation((errors) =>
      errors.join(", "),
    );

    delete process.env.REQUIRED_VAR;

    expect(() => validateEnv(schema)).toThrow("REQUIRED_VAR is required");
  });

  test("should use custom error formatter", () => {
    const schema = {
      REQUIRED_VAR: { type: "string", required: true },
    } as EnvSchema;

    const mockFormatter = jest.fn().mockReturnValue("custom error");

    jest.spyOn(dotenv, "config").mockImplementation(() => ({ parsed: {} }));
    (checkUnknownKeys as jest.Mock).mockReturnValue([]);
    (resolveEnvKey as jest.Mock).mockImplementation((key) => key);
    (parseValue as jest.Mock).mockImplementation((_, value) => value);

    delete process.env.REQUIRED_VAR;

    expect(() => validateEnv(schema, { formatError: mockFormatter })).toThrow(
      "custom error",
    );
    expect(mockFormatter).toHaveBeenCalledWith(["REQUIRED_VAR is required"]);
  });

  test("should include errors from checkUnknownKeys", () => {
    const schema = {
      FOO: { type: "string", required: true },
    } as EnvSchema;

    jest.spyOn(dotenv, "config").mockImplementation(() => ({ parsed: {} }));
    (checkUnknownKeys as jest.Mock).mockReturnValue([
      "Unknown env variables: BAR",
    ]);
    (resolveEnvKey as jest.Mock).mockImplementation((key) => key);
    (parseValue as jest.Mock).mockImplementation((_, value) => value);
    (defaultErrorFormatter as jest.Mock).mockImplementation((errors) =>
      errors.join(", "),
    );

    process.env.FOO = "fooValue";

    expect(() => validateEnv(schema, { strict: true })).toThrow(
      "Unknown env variables: BAR",
    );
  });
});
