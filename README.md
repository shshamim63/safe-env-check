# safe-env-check

![npm](https://img.shields.io/npm/v/@safe-hand/safe-env-check)
![license](https://img.shields.io/npm/l/@safe-hand/safe-env-check)
![downloads](https://img.shields.io/npm/dm/@safe-hand/safe-env-check)
![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue)
![CI](https://github.com/shshamim63/safe-env-check/actions/workflows/release.yml/badge.svg)
![Coverage](https://img.shields.io/codecov/c/github/shshamim63/safe-env-check)

> **Fail fast. Validate early. Deploy safely.**

A strict, **TypeScript-first** environment validator that ensures your application never starts—or deploys—with invalid configuration.

Built for developers who want **zero surprises in production** and reliable **CI/CD validation**.

---

## 🚀 Quick Start (30 seconds)

```ts
import { validateEnv } from "@safe-hand/safe-env-check";

const env = validateEnv({
  PORT: { type: "number", default: 3000 },
  NODE_ENV: {
    type: "enum",
    values: ["development", "production"],
    default: "development",
  },
});

env.PORT; // number
env.NODE_ENV; // "development" | "production"
```

---

## Why safe-env-check?

Environment variables are fragile and error-prone.

Common problems:

- Missing required variables → runtime crashes
- Incorrect types → hidden bugs
- Unexpected variables → misconfigurations
- Broken `.env` files → failed deployments
- CI/CD pipelines deploying invalid configs

**safe-env-check eliminates these risks before your app runs.**

---

## 🔥 What makes it different?

Unlike general-purpose validators, **safe-env-check is built specifically for environment validation workflows**:

- ✅ Fail fast before app startup
- ✅ Detect unknown variables (strict mode)
- ✅ Validate configs in CI/CD pipelines
- ✅ Support multi-service setups with prefixes

---

## Features

- ✅ Type validation (`string`, `number`, `boolean`, `enum`)
- ✅ Required values
- ✅ Default values
- ✅ Enum validation
- ✅ Strict mode (no unknown variables)
- ✅ Prefix support (multi-environment setup)
- ✅ dotenv integration
- ✅ Custom error formatting
- ✅ Fully type-safe output
- ✅ CLI support (CI/CD ready)
- ✅ Designed for production safety

---

## Installation

```bash
npm install @safe-hand/safe-env-check
```

or

```bash
yarn add @safe-hand/safe-env-check
```

---

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

---

## Schema Options

Each environment variable supports the following options:

| Field      | Type                                          | Description                      |
| ---------- | --------------------------------------------- | -------------------------------- |
| `type`     | `"string" or "number" or "boolean" or "enum"` | Expected value type              |
| `required` | `boolean`                                     | Whether the variable is required |
| `default`  | `any`                                         | Default value if not provided    |
| `values`   | `string[]`                                    | Required for `enum` type         |

---

## Example Schema

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

---

## Default Values

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

```bash
PORT=3000
```

---

## Required Variables

```ts
const schema = {
  DATABASE_URL: { type: "string", required: true },
};
```

If missing:

```bash
Error ❌ Environment validation failed:
- DATABASE_URL is required
```

---

## Boolean Parsing

Accepted values:

```bash
true
false
```

---

## Enum Validation

Restrict values to a predefined list:

```ts
NODE_ENV: {
  type: "enum",
  values: ["development", "production", "test"],
}
```

Invalid values will throw an error.

---

## Strict Mode (recommended)

Prevent unexpected environment variables:

```ts
validateEnv(schema, { strict: true });
```

```bash
Unknown env variables: SOME_RANDOM_VAR
```

---

## Prefix Support

Useful for multi-service or multi-tenant configurations.

**Example `.env`:**

```bash
API_PORT=3000
API_SECRET=123
```

**Usage:**

```ts
validateEnv(schema, { prefix: "API_" });
```

---

## Env File Support

Load custom env files:

```ts
validateEnv(schema, {
  envFile: ".env.production",
});
```

---

## Custom Error Formatter

```ts
validateEnv(schema, {
  formatError: (errors) => `Config error:\n${errors.join("\n")}`,
});
```

---

## Loading Environment Variables

`safe-env-check` uses `dotenv` to automatically load `.env` files.

---

## CLI Usage (CI/CD ready)

Validate environment variables **without writing code**:

```bash
npx safe-env-check env.schema.js --strict
```

Perfect for:

- CI pipelines
- Docker builds
- Deployment validation

---

### CLI Options

| Flag            | Description              |
| --------------- | ------------------------ |
| `--schema`      | Schema file path         |
| `--env-file`    | Load custom env file     |
| `--strict`      | Enable strict mode       |
| `--prefix`      | Env variable prefix      |
| `--format json` | Output errors in JSON    |
| `--quiet`       | Suppress success message |

---

### CLI Examples

```bash
npx safe-env-check env.schema.js
npx safe-env-check env.schema.js --strict
npx safe-env-check env.schema.js --prefix API_
npx safe-env-check env.schema.js --env-file .env.production
npx safe-env-check env.schema.js --format json
```

---

## CI/CD Example

```yaml
- name: Validate Environment Variables
  run: npx safe-env-check env.schema.js --env-file .env.production --strict
```

Prevents deployments with invalid configuration.

---

## TypeScript Type Safety

```ts
const env = validateEnv(schema);

env.PORT; // number
env.NODE_ENV; // inferred union type
```

---

## When to Use safe-env-check

- Node.js APIs
- NestJS applications
- Microservices
- Docker containers
- CI/CD pipelines
- Serverless functions
- Monorepos

---

## Contributing

Contributions are welcome! Open an issue or PR.

---

## Changelog

https://github.com/shshamim63/safe-env-check/releases

---

## License

MIT © Shakhawat Hossain
