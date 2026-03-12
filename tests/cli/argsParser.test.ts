import { parseArgs } from "../../src/cli/argsParser";

describe("parseArgs", () => {
  // ─── Schema file ─────────────────────────────────────────────────────────

  it("parses --schema flag", () => {
    expect(parseArgs(["--schema", "env.schema.js"])).toMatchObject({
      schemaFile: "env.schema.js",
    });
  });

  it("accepts schema file as a positional argument", () => {
    expect(parseArgs(["env.schema.js"])).toMatchObject({
      schemaFile: "env.schema.js",
    });
  });

  it("prefers --schema flag over positional argument", () => {
    expect(
      parseArgs(["positional.js", "--schema", "flagged.js"]),
    ).toMatchObject({ schemaFile: "flagged.js" });
  });

  it("leaves schemaFile undefined when not provided", () => {
    expect(parseArgs([])).toMatchObject({ schemaFile: undefined });
  });

  // ─── Boolean flags ───────────────────────────────────────────────────────

  it("sets strict to true when --strict is present", () => {
    expect(parseArgs(["--strict"])).toMatchObject({ strict: true });
  });

  it("sets strict to false when --strict is absent", () => {
    expect(parseArgs([])).toMatchObject({ strict: false });
  });

  it("sets quiet to true when --quiet is present", () => {
    expect(parseArgs(["--quiet"])).toMatchObject({ quiet: true });
  });

  it("sets quiet to false when --quiet is absent", () => {
    expect(parseArgs([])).toMatchObject({ quiet: false });
  });

  it("sets help to true when --help is present", () => {
    expect(parseArgs(["--help"])).toMatchObject({ help: true });
  });

  it("sets version to true when --version is present", () => {
    expect(parseArgs(["--version"])).toMatchObject({ version: true });
  });

  // ─── Value flags ─────────────────────────────────────────────────────────

  it("parses --prefix value", () => {
    expect(parseArgs(["--prefix", "APP_"])).toMatchObject({ prefix: "APP_" });
  });

  it("parses --env-file value", () => {
    expect(parseArgs(["--env-file", ".env.production"])).toMatchObject({
      envFile: ".env.production",
    });
  });

  it("parses --format json", () => {
    expect(parseArgs(["--format", "json"])).toMatchObject({ format: "json" });
  });

  it("leaves prefix undefined when not provided", () => {
    expect(parseArgs([])).toMatchObject({ prefix: undefined });
  });

  it("leaves envFile undefined when not provided", () => {
    expect(parseArgs([])).toMatchObject({ envFile: undefined });
  });

  // ─── Combined flags ───────────────────────────────────────────────────────

  it("parses multiple flags together", () => {
    const result = parseArgs([
      "--schema",
      "env.schema.js",
      "--strict",
      "--quiet",
      "--prefix",
      "APP_",
    ]);
    expect(result).toMatchObject({
      schemaFile: "env.schema.js",
      strict: true,
      quiet: true,
      prefix: "APP_",
    });
  });
});
