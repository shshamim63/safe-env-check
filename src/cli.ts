import dotenv from "dotenv";

import path from "path";
import fs from "fs";

import { version } from "../package.json";

import { validateEnv } from "./validateEnv";

const args = process.argv.slice(2);

const getArg = (flag: string): string | undefined => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : undefined;
};

const printHelp = () => {
  console.log(`
    safe-env-check


    Usage:
      save-env-check <schema-file> [opttions]


    Options:
      --schema <file>           Path to schema file
      --strict                  Enable strict mode
      --env-file <file>         Load a custom .env file
      --format json             Outut errors as JSON
      --quiet                   Suppress success message
      --version                 Show version
      --help                    Show help

    
    Examples:
      save-env-check env.schema.js
      save-env-check --schema env.schema.js --strict
      save-env-check env.schema.js --env-file .env.production
      save-env-check env.schema.js --foramt json
    `);
};

const hasFlag = (flag: string) => args.includes(flag);

if (hasFlag("--help")) {
  printHelp();
  process.exit(0);
}

if (hasFlag("--version")) {
  console.log(version);
  process.exit(0);
}

const schemaFile = getArg("--schema") || args[0];

if (!schemaFile) {
  console.error("❌ Schema file is required.\n");
  printHelp();
  process.exit(1);
}

const envFile = getArg("--env-file");

if (envFile) {
  dotenv.config({ path: envFile });
}

const isStrict = hasFlag("--strict");
const isQuiet = hasFlag("--quiet");
const format = getArg("--format");

try {
  const fullPath = path.resolve(process.cwd(), schemaFile);
  console.log("I am here");
  if (!fs.existsSync(fullPath))
    throw new Error(`Schema file not found: ${schemaFile}`);

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
  console.log(error);
  process.exit(1);
}
