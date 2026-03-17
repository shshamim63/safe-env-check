import { EnvSchema } from "../../src/types";
import { checkUnknownKeys } from "../../src/validateEnv/checkUnknownKeys";
import { readEnvFile } from "../../src/utils/readCustomFile";

jest.mock("../../src/utils/readCustomFile");

describe("checkUnknownKeys", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns empty array if no unknown keys", () => {
    const schema = {
      PORT: { type: "number", required: true },
      MONGO_URI: { type: "string", required: true },
    } as EnvSchema;

    (readEnvFile as jest.Mock).mockReturnValue({
      PORT: "3000",
      MONGO_URI: "mongodb://localhost",
    });

    expect(checkUnknownKeys(schema, ".env")).toEqual([]);
    expect(readEnvFile).toHaveBeenCalledWith(".env");
  });

  test("returns unknown keys when extra env variables exist", () => {
    const schema = {
      PORT: { type: "number", required: true },
    } as EnvSchema;

    (readEnvFile as jest.Mock).mockReturnValue({
      PORT: "3000",
      EXTRA_VAR: "value",
      ANOTHER_ONE: "value2",
    });

    const result = checkUnknownKeys(schema, ".env");

    expect(result).toEqual(["Unknown env variables: EXTRA_VAR, ANOTHER_ONE"]);
  });

  test("respects prefix", () => {
    const schema = {
      PORT: { type: "number", required: true },
    } as EnvSchema;

    (readEnvFile as jest.Mock).mockReturnValue({
      DEV_PORT: "3000",
      DEV_EXTRA: "oops",
      PROD_PORT: "5000",
    });

    const result = checkUnknownKeys(schema, ".env", "DEV_");

    expect(result).toEqual(["Unknown env variables: DEV_EXTRA"]);
  });

  test("returns empty array if file is empty", () => {
    const schema = {
      PORT: { type: "number", required: true },
    } as EnvSchema;

    (readEnvFile as jest.Mock).mockReturnValue({});

    const result = checkUnknownKeys(schema, ".env");

    expect(result).toEqual([]);
  });
});
