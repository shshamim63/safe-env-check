import { printHelp } from "../../src/cli/help";

describe("printHelp", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("calls console.log once", () => {
    printHelp();
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("output contains the command name", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("safe-env-check");
  });

  it("output contains --schema flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--schema");
  });

  it("output contains --strict flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--strict");
  });

  it("output contains --prefix flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--prefix");
  });

  it("output contains --help flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--help");
  });

  it("output contains --version flag", () => {
    printHelp();
    const output: string = logSpy.mock.calls[0][0];
    expect(output).toContain("--version");
  });
});
