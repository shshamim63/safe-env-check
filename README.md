# safe-env-check

![npm](https://img.shields.io/npm/v/@safe-hand/safe-env-check)
![license](https://img.shields.io/npm/l/@safe-hand/safe-env-check)
![downloads](https://img.shields.io/npm/dm/@safe-hand/safe-env-check)


A tiny TypeScript library to validate environment variables using a schema with support for:

- ✅ Type validation
- ✅ Required & default values
- ✅ Enum values
- ✅ Strict mode (no extra env vars)
- ✅ dotenv integration
- ✅ Custom error formatting
- ✅ CLI support

---

## Installation

```bash
npm install @safe-hand/safe-env-check
```
or
```bash
yarn add @safe-hand/safe-env-check
```

## Features

- Validate process.env using a schema

- Strongly typed output (TypeScript)

- Prevents app startup with invalid configuration

- Supports CLI for CI/CD and deployment checks

- Customizable error messages

- Optional strict mode to disallow unknown variables

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

console.log(env.PORT);       // number
console.log(env.NODE_ENV);   // "development" | "production"
```

## Schema Options
Each environment variables supports the following options:

| Field      | Type       | Description                      |           |         |                     |
| ---------- | ---------- | -------------------------------- | --------- | ------- | ------------------- |
| `type`     | `"string"  or "number" or "boolean" or "enum"` | Expected value type |
| `required` | `boolean`  | Whether the variable is required |           |         |                     |
| `default`  | `any`      | Default value if not provided    |           |         |                     |
| `values`   | `string[]` | Required for `enum` type         |           |         |                     |

## Example
```ts
DATABASE_URL: { type: "string", required: true },
DEBUG: { type: "boolean", default: false },
MODE: { type: "enum", values: ["dev", "prod"] }
```

## Strict Mode
Disallow environment variables that are not defined in the schema.
```ts
validateEnv(schema, { strict: true });
```
If extra variables are found, validation will fail.

## Custom Error Formatter
You can control how errors are displayed:
```ts
validateEnv(schema, {
  formatError: (errors) => `Config error:\n${errors.join("\n")}`,
});
```

## Dotenv Support

By default, the library loads .env automatically using dotenv.

Example .env file:
```bash
PORT=3000
JWT_SECRET=supersecret
NODE_ENV=development
```

## CLI Usage

Create a schema file called env.schema.js:
```ts
module.exports = {
  PORT: { type: "number", required: true },
  NODE_ENV: { type: "enum", values: ["dev", "prod"], default: "dev" },
};
```

Run validation:
```bash
npx safe-env-check env.schema.js
```

## License

MIT © Shakhawat Hossain