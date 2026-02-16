import path from "path";
import { validateEnv } from "./validateEnv";

const schemaPath = process.argv[2];

if (!schemaPath) {
  console.error("Usage: safe-env-check <schema-file>");
  process.exit(1);
}

try {
  const fullPath = path.resolve(process.cwd(), schemaPath);
  const schema = require(fullPath);

  validateEnv(schema);
  console.log("✅ Environment variables are valid");
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
