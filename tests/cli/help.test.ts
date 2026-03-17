import { printHelp } from "../../src/cli/help";

describe("printHelp", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test("calls console.log once", () => {
    printHelp();
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  test("output contains the command name", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("safe-env-check");
  });

  test("output contains --schema flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--schema");
  });

  test("output contains --strict flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--strict");
  });

  test("output contains --prefix flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--prefix");
  });

  test("output contains --help flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--help");
  });

  test("output contains --version flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--version");
  });
});
