# safe-env-check

![npm](https://img.shields.io/npm/v/@safe-hand/safe-env-check)
![license](https://img.shields.io/npm/l/@safe-hand/safe-env-check)
![downloads](https://img.shields.io/npm/dm/@safe-hand/safe-env-check)

A tiny TypeScript-first environment variable validator that ensures your application starts with a correct configuration.

It validates process.env using a schema and provides strong **TypeScript typing**, **CLI validation**, and **CI/CD integration**.

## Why safe-env-check?

Environment variables are string-based and error-prone.

Common problems:

- Missing required variables
- Incorrect types
- Unexpected environment variables
- Misconfigured deployments
- Incorrect .env files in CI/CD

safe-env-check prevents these issues **before your app starts**.

## Features

- ✅ Type validation (`string`, `number`, `boolean`, `enum`)
- ✅ Required & default values
- ✅ Default values
- ✅ Enum validation
- ✅ Strict mode (no unknown variables)
- ✅ Prefix support (multi-environment setup)
- ✅ dotenv integration
- ✅ Custom error formatting
- ✅ Type-safe output for TypeScript
- ✅ CLI support
- ✅ CI/CD friendly

---

## Installation

```bash
npm install @safe-hand/safe-env-check
```

or

```bash
yarn add @safe-hand/safe-env-check
```

## Basic Usage

### Define a schema

```ts
const schema = {
  PORT: { type: "number", required: true },
  JWT_SECRET: { type: "string", required: true },
  NODE_ENV: {
    type: "enum",
    values: ["development", "production"],
    default: "development",
  },
};
```

### Validate environment variables

```ts
import { validateEnv } from "@safe-hand/safe-env-check";

const env = validateEnv(schema);

console.log(env.PORT); // number
console.log(env.NODE_ENV); // "development" | "production"
```

### Schema Options

Each environment variables supports the following options:

| Field      | Type                                           | Description                      |
| ---------- | ---------------------------------------------- | -------------------------------- |
| `type`     | `"string"  or "number" or "boolean" or "enum"` | Expected value type              |
| `required` | `boolean`                                      | Whether the variable is required |
| `default`  | `any`                                          | Default value if not provided    |
| `values`   | `string[]`                                     | Required for `enum` type         |

### Example Schema

```ts
const schema = {
  DATABASE_URL: { type: "string", required: true },
  PORT: { type: "number", default: 3000 },
  DEBUG: { type: "boolean", default: false },
  MODE: {
    type: "enum",
    values: ["dev", "prod"],
  },
};
```

### Default Values

If a variable is missing, the default value will be used.

```ts
const schema = {
  PORT: { type: "number", default: 3000 },
};
```

**`.env`**

```bash
# PORT missing
```

**Result:**

```cmd
PORT = 3000
```

### Required Variables

```ts
const schema = {
  DATABASE_URL: { type: "string", required: true },
};
```

If missing:

```cmd
Error ❌ Environment validation failed:
- DATABASE_URL is required
```

### Boolean Parsing

Boolean values accept:

```bash
true
false
1
0
```

**Example:**

```cmd
DEBUG=true
```

**Schema**

```ts
DEBUG: {
  type: "boolean";
}
```

### Enum Validation

Restrict values to a predefined list.

```ts
NODE_ENV: {
  type: "enum",
  values: ["development", "production", "test"],
}
```

Invalid values will throw an error.

### Strict Mode

Prevent unexpected environment variables.

```ts
validateEnv(schema, { strict: true });
```

If .env contains variables not defined in the schema:

```cmd
Unknown env variables: SOME_RANDOM_VAR
```

### Prefix Support

Useful for multi-service or multi-tenant configs.

**Example** `.env`:

```bash
API_PORT=3000
API_SECRET=123
```

**Schema:**

```ts
const schema = {
  PORT: { type: "number" },
  SECRET: { type: "string" },
};
```

**Usage:**

```ts
validateEnv(schema, { prefix: "API_" });
```

### Custom Error Formatter

You can control how errors are displayed:

```ts
validateEnv(schema, {
  formatError: (errors) => `Config error:\n${errors.join("\n")}`,
});
```

## Dotenv Support

By default, the library loads .env automatically using dotenv.

**Example** `.env`:

```bash
PORT=3000
JWT_SECRET=supersecret
NODE_ENV=development
```

### Using Custom .env File

```ts
validateEnv(schema, {
  envFile: ".env.production",
});
```

## CLI Usage

You can validate environment variables without writing code.

This is useful for CI/CD pipelines.
```ts
module.exports = {
  PORT: { type: "number", required: true },
  NODE_ENV: { type: "enum", values: ["dev", "prod"], default: "dev" },
};
```

**Run validation:**
```cmd
npx safe-env-check env.schema.js
```
or
```cmd
npx safe-env-check --schema env.schema.js
```
### CLI Options 
| Flag            | Description            |
| --------------- | ---------------------- |
| `--schema`      | schema file path       |
| `--env-file`    | load a custom env file |
| `--strict`      | enable strict mode     |
| `--prefix`      | env variable prefix    |
| `--format json` | output errors in JSON  |

### CLI Examples
**Basic validation**
```cmd
npx safe-env-check env.schema.js
```

**Using strict mode**
```cmd
npx safe-env-check env.schema.js --strict
```

**Using prefix**
```cmd
npx safe-env-check env.schema.js --prefix API_
```

**Validate production env file**
```cmd
npx safe-env-check env.schema.js --env-file .env.production
```

**JSON error output**
```cmd
npx safe-env-check env.schema.js --format json
```
Useful for CI systems.

## CI/CD Example
Validate environment configuration during deployment.

Example **GitHub Actions step**
```yaml
- name: Validate Environment Variables
  run: npx safe-env-check env.schema.js --env-file .env.production --strict
```
This prevents deployments with invalid configuration.

## TypeScript Type Safety
The returned object is fully typed.
```ts
const env = validateEnv(schema);

env.PORT // number
env.NODE_ENV // "development" | "production"
```
## When to Use safe-env-check
- Node.js APIs
- Microservices
- Docker containers
- CI/CD pipelines
- Serverless functions
- Monorepos
- Multi-environment deployments

## License

MIT © Shakhawat Hossain
