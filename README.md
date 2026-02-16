# safe-env-check

A tiny TypeScript library to validate environment variables with schema, strict mode, dotenv and CLI support.

## Install

```bash
npm install safe-env-check
```

## Usage

```js
import { validateEnv } from "safe-env-check";

const env = validateEnv({
  PORT: { type: "number", required: true },
  JWT_SECRET: { type: "string", required: true },
  NODE_ENV: {
    type: "enum",
    values: ["development", "production"],
    default: "development",
  },
});
```

**With Strict Mode**

```js
validateEnv(schema, { strict: true });
```

**With Custom Error Formatter**

```js
validateEnv(schema, {
  formatError: (errors) => `Config error:\n${errors.join("\n")}`,
});
```

## CLI

Create a file called env.schema.js

```js
module.exports = {
  PORT: { type: "number", required: true },
  NODE_ENV: { type: "enum", values: ["dev", "prod"] },
};
```
```bash
  npx safe-env-check env.schema.js
```