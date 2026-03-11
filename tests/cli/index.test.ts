// tests/cli/index.test.ts
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

// Mock modules
jest.mock("dotenv");
jest.mock("../../package.json", () => ({ version: "1.2.3" }));
jest.mock("../../src/validateEnv", () => ({
  validateEnv: jest.fn(),
}));
jest.mock("../../src/cli/argsParser", () => ({
  parseArgs: jest.fn(),
}));
jest.mock("../../src/cli/help", () => ({
  printHelp: jest.fn(),
}));

import { validateEnv } from "../../src/validateEnv";
import { parseArgs } from "../../src/cli/argsParser";
import { printHelp } from "../../src/cli/help";

// Helper to reset process.argv
const resetArgv = () => {
  process.argv = ["node", "cli.ts"];
};

describe("CLI", () => {
  let exitSpy: any;
  let logSpy: any;
  let errorSpy: any;

  beforeEach(() => {
    exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null) => {
        throw new Error(`process.exit:${code ?? 0}`);
      });
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    resetArgv();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows help when --help is passed", async () => {
    (parseArgs as jest.Mock).mockReturnValue({ help: true });
    try {
      await import("../../src/cli/index"); // dynamic import for fresh module load
    } catch (err: any) {
      expect(err.message).toBe("process.exit:0");
    }

    expect(printHelp).toHaveBeenCalled();
  });

  it("shows version when --version is passed", async () => {
    (parseArgs as jest.Mock).mockReturnValue({ version: true });
    try {
      await import("../../src/cli/index");
    } catch (err: any) {
      expect(err.message).toBe("process.exit:0");
    }

    expect(logSpy).toHaveBeenCalledWith("1.2.3");
  });

  it("fails when schemaFile is missing", async () => {
    (parseArgs as jest.Mock).mockReturnValue({});
    try {
      await import("../../src/cli/index");
    } catch (err: any) {
      expect(err.message).toBe("process.exit:1");
    }

    expect(errorSpy).toHaveBeenCalledWith("❌ Schema file is required\n");
    expect(printHelp).toHaveBeenCalled();
  });

  it("fails when schemaFile does not exist", async () => {
    (parseArgs as jest.Mock).mockReturnValue({ schemaFile: "missing.ts" });
    jest.spyOn(fs, "existsSync").mockReturnValue(false);

    try {
      await import("../../src/cli/index");
    } catch (err: any) {
      expect(err.message).toBe("process.exit:1");
    }

    expect(errorSpy).toHaveBeenCalledWith("❌ Schema file is required\n");
    expect(printHelp).toHaveBeenCalled();
  });

  it("runs successfully with valid schema", async () => {
    (parseArgs as jest.Mock).mockReturnValue({ schemaFile: "schema.ts" });
    jest.spyOn(fs, "existsSync").mockReturnValue(true);

    const mockSchema = { FOO: { type: "string" } };
    jest.doMock(path.resolve(process.cwd(), "schema.ts"), () => mockSchema, {
      virtual: true,
    });
    (validateEnv as jest.Mock).mockReturnValue({});

    try {
      await import("../../src/cli/index");
    } catch (err: any) {
      expect(err.message).toBe("process.exit:1");
    }

    expect(validateEnv).toHaveBeenCalledWith(mockSchema, expect.any(Object));
    expect(logSpy).toHaveBeenCalledWith("✅ Environment variables are valid");
  });
});
