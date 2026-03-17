#!/usr/bin/env node

import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { version } from "../../package.json";
import { parseArgs } from "./argsParser";
import { validateEnv } from "../validateEnv/validateEnv";
import { printHelp } from "./help";
import {
  defaultErrorFormatter,
  jsonErrorFormatter,
} from "../errors/errorFormatter";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.version) {
  console.log(version);
  process.exit(0);
}

if (!options.schemaFile) {
  console.error("❌ Schema file is required\n");
  printHelp();
  process.exit(1);
}

if (options.envFile) {
  dotenv.config({ path: options.envFile });
}

const schemaPath = path.resolve(process.cwd(), options.schemaFile);

if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Schema file not found: ${schemaPath}\n`);
  printHelp();
  process.exit(1);
}

try {
  const schema = require(schemaPath);

  validateEnv(schema, {
    strict: options.strict,
    prefix: options.prefix,
    formatError: (errors) => {
      if (options.format === "json") {
        return jsonErrorFormatter(errors);
      }

      return defaultErrorFormatter(errors);
    },
  });

  if (!options.quiet) {
    console.log("✅ Environment variables are valid");
  }

  process.exit(0);
} catch (err: any) {
  console.error(err.message);
  process.exit(1);
}
