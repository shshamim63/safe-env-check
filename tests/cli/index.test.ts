// tests/cli/index.test.ts
import fs from "fs";
import path from "path";

beforeEach(() => {
  jest.resetModules();
});

const setupSpies = () => {
  const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const exitSpy = jest
    .spyOn(process, "exit")
    .mockImplementation((code?: string | number | null) => {
      throw new Error(`process.exit:${code ?? 0}`);
    });
  return { logSpy, errorSpy, exitSpy };
};

describe("CLI", () => {
  test("shows help when --help is passed", async () => {
    const { logSpy, errorSpy, exitSpy } = setupSpies();

    await jest.isolateModulesAsync(async () => {
      const printHelpMock = jest.fn();
      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({ help: true })),
      }));
      jest.doMock("../../src/cli/help", () => ({
        printHelp: printHelpMock,
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:0");
      }

      expect(printHelpMock).toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    exitSpy.mockRestore();
  });

  test("shows version when --version is passed", async () => {
    const { logSpy, errorSpy, exitSpy } = setupSpies();

    await jest.isolateModulesAsync(async () => {
      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({ version: true })),
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:0");
      }

      expect(logSpy).toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    exitSpy.mockRestore();
  });

  test("fails when schemaFile is missing", async () => {
    const { errorSpy, exitSpy } = setupSpies();

    await jest.isolateModulesAsync(async () => {
      const printHelpMock = jest.fn();
      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({})),
      }));
      jest.doMock("../../src/cli/help", () => ({
        printHelp: printHelpMock,
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:1");
      }

      expect(errorSpy).toHaveBeenCalledWith("❌ Schema file is required\n");
      expect(printHelpMock).toHaveBeenCalled();
    });

    exitSpy.mockRestore();
  });

  test("fails when schemaFile does not exist", async () => {
    const { errorSpy, exitSpy } = setupSpies();

    jest.spyOn(fs, "existsSync").mockReturnValue(false);

    await jest.isolateModulesAsync(async () => {
      const printHelpMock = jest.fn();
      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({ schemaFile: "missing.ts" })),
      }));
      jest.doMock("../../src/cli/help", () => ({
        printHelp: printHelpMock,
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:1");
      }

      expect(errorSpy).toHaveBeenCalledWith("❌ Schema file is required\n");
      expect(printHelpMock).toHaveBeenCalled();
    });

    exitSpy.mockRestore();
  });

  test("runs successfully with valid schema", async () => {
    const { logSpy, exitSpy } = setupSpies();

    jest.spyOn(fs, "existsSync").mockReturnValue(true);

    await jest.isolateModulesAsync(async () => {
      const mockSchema = { FOO: { type: "string" } };

      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({ schemaFile: "schema.ts" })),
      }));

      jest.doMock(path.resolve(process.cwd(), "schema.ts"), () => mockSchema, {
        virtual: true,
      });

      const validateMock = jest.fn(() => ({ FOO: "bar" }));
      jest.doMock("../../src/validateEnv/validateEnv", () => ({
        validateEnv: validateMock,
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:1");
      }

      const { validateEnv } = await import("../../src/validateEnv/validateEnv");
      expect(validateEnv).toHaveBeenCalledWith(mockSchema, expect.any(Object));
      expect(logSpy).toHaveBeenCalledWith("✅ Environment variables are valid");
    });

    exitSpy.mockRestore();
  });

  test("runs in quiet mode without logging success", async () => {
    const { logSpy, exitSpy } = setupSpies();

    jest.spyOn(fs, "existsSync").mockReturnValue(true);

    await jest.isolateModulesAsync(async () => {
      const mockSchema = { FOO: { type: "string" } };
      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({ schemaFile: "schema.ts", quiet: true })),
      }));
      jest.doMock(path.resolve(process.cwd(), "schema.ts"), () => mockSchema, {
        virtual: true,
      });
      jest.doMock("../../src/validateEnv/validateEnv", () => ({
        validateEnv: jest.fn(() => ({ FOO: "bar" })),
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:1");
      }
    });

    exitSpy.mockRestore();
  });

  test("formats errors as JSON when --format=json", async () => {
    const { errorSpy, exitSpy } = setupSpies();

    jest.spyOn(fs, "existsSync").mockReturnValue(true);

    await jest.isolateModulesAsync(async () => {
      const mockSchema = { FOO: { type: "string" } };
      jest.doMock("../../src/cli/argsParser", () => ({
        parseArgs: jest.fn(() => ({
          schemaFile: "schema.ts",
          format: "json",
        })),
      }));
      jest.doMock(path.resolve(process.cwd(), "schema.ts"), () => mockSchema, {
        virtual: true,
      });
      const validateMock = jest.fn(() => {
        throw new Error("Validation failed");
      });
      jest.doMock("../../src/validateEnv/validateEnv", () => ({
        validateEnv: validateMock,
      }));

      try {
        await import("../../src/cli/index");
      } catch (err: any) {
        expect(err.message).toBe("process.exit:1");
      }

      const { validateEnv } = await import("../../src/validateEnv/validateEnv");
      expect(validateEnv).toHaveBeenCalledWith(mockSchema, expect.any(Object));
      expect(errorSpy).toHaveBeenCalled();
    });

    exitSpy.mockRestore();
  });
});
