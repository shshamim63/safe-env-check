import { parseArgs } from "../../src/cli/argsParser";

describe("parseArgs", () => {
  // ─── Schema file ─────────────────────────────────────────────────────────

  test("parses --schema flag", () => {
    expect(parseArgs(["--schema", "env.schema.js"])).toMatchObject({
      schemaFile: "env.schema.js",
    });
  });

  test("accepts schema file as a positional argument", () => {
    expect(parseArgs(["env.schema.js"])).toMatchObject({
      schemaFile: "env.schema.js",
    });
  });

  test("prefers --schema flag over positional argument", () => {
    expect(
      parseArgs(["positional.js", "--schema", "flagged.js"]),
    ).toMatchObject({ schemaFile: "flagged.js" });
  });

  test("leaves schemaFile undefined when not provided", () => {
    expect(parseArgs([])).toMatchObject({ schemaFile: undefined });
  });

  // ─── Boolean flags ───────────────────────────────────────────────────────

  test("sets strict to true when --strict is present", () => {
    expect(parseArgs(["--strict"])).toMatchObject({ strict: true });
  });

  test("sets strict to false when --strict is absent", () => {
    expect(parseArgs([])).toMatchObject({ strict: false });
  });

  test("sets quiet to true when --quiet is present", () => {
    expect(parseArgs(["--quiet"])).toMatchObject({ quiet: true });
  });

  test("sets quiet to false when --quiet is absent", () => {
    expect(parseArgs([])).toMatchObject({ quiet: false });
  });

  test("sets help to true when --help is present", () => {
    expect(parseArgs(["--help"])).toMatchObject({ help: true });
  });

  test("sets version to true when --version is present", () => {
    expect(parseArgs(["--version"])).toMatchObject({ version: true });
  });

  // ─── Value flags ─────────────────────────────────────────────────────────

  test("parses --prefix value", () => {
    expect(parseArgs(["--prefix", "APP_"])).toMatchObject({ prefix: "APP_" });
  });

  test("parses --env-file value", () => {
    expect(parseArgs(["--env-file", ".env.production"])).toMatchObject({
      envFile: ".env.production",
    });
  });

  test("parses --format json", () => {
    expect(parseArgs(["--format", "json"])).toMatchObject({ format: "json" });
  });

  test("leaves prefix undefined when not provided", () => {
    expect(parseArgs([])).toMatchObject({ prefix: undefined });
  });

  test("leaves envFile undefined when not provided", () => {
    expect(parseArgs([])).toMatchObject({ envFile: undefined });
  });

  // ─── Combined flags ───────────────────────────────────────────────────────

  test("parses multiple flags together", () => {
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
