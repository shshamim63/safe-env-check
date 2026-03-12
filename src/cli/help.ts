export const printHelp = () => {
  console.log(`
safe-env-check

Usage:
  safe-env-check <schema-file> [options]

Options:
  --schema <file>           Path to schema file
  --strict                  Enable strict mode
  --prefix <PREFIX>         Prefix for env variables (ex: APP_)
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
  safe-env-check --strict env.schema.js --prefix APP_
`);
};
