import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { version } from "../package.json";
import { validateEnv } from "./validateEnv";

const args = process.argv.slice(2);

/**
 * Get value of a flag: --schema file, --env-file file, --format json
 */
const getArg = (flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : undefined;
};

/**
 * Check if flag exists
 */
const hasFlag = (flag: string) => args.includes(flag);

/**
 * Extract positional (non-flag) arguments safely
 */
const getPositionalArgs = (args: string[]) => {
  return args.filter((arg, index) => {
    // remove flags
    if (arg.startsWith("--")) return false;

    // remove values of flags
    const prev = args[index - 1];
    if (prev === "--schema" || prev === "--env-file" || prev === "--format") {
      return false;
    }

    return true;
  });
};

const printHelp = () => {
  console.log(`
safe-env-check

Usage:
  safe-env-check <schema-file> [options]

Options:
  --schema <file>           Path to schema file
  --strict                  Enable strict mode
  --env-file <file>         Load a custom .env file
  --format json             Output errors as JSON
  --quiet                   Suppress success message
  --version                 Show version
  --help                    Show help

Examples:
  safe-env-check env.schema.js
  safe-env-check --schema env.schema.js --strict
  safe-env-check env.schema.js --env-file .env.production
  safe-env-check env.schema.js --format json
  safe-env-check --strict env.schema.js
`);
};

/* =======================
   Early exit flags
======================= */

if (hasFlag("--help")) {
  printHelp();
  process.exit(0);
}

if (hasFlag("--version")) {
  console.log(version);
  process.exit(0);
}

/* =======================
   Resolve schema file
======================= */

const positionalArgs = getPositionalArgs(args);
const schemaFile = getArg("--schema") || positionalArgs[0];

if (!schemaFile) {
  console.error("❌ Schema file is required.\n");
  printHelp();
  process.exit(1);
}

/* =======================
   Load env file if provided
======================= */

const envFile = getArg("--env-file");

if (envFile) {
  dotenv.config({ path: envFile });
}

/* =======================
   Flags
======================= */

const isStrict = hasFlag("--strict");
const isQuiet = hasFlag("--quiet");
const format = getArg("--format");

/* =======================
   Main logic
======================= */

try {
  const fullPath = path.resolve(process.cwd(), schemaFile);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Schema file not found: ${schemaFile}`);
  }

  const schema = require(fullPath);

  validateEnv(schema, {
    strict: isStrict,
    formatError: (errors) => {
      if (format === "json") {
        return JSON.stringify({ errors }, null, 2);
      }

      return (
        "❌ Environment validation failed:\n" +
        errors.map((e) => `- ${e}`).join("\n")
      );
    },
  });

  if (!isQuiet) {
    console.log("✅ Environment variables are valid");
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
