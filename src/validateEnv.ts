import dotenv from "dotenv";

import { defaultErrorFormatter } from "./errors/errorFormatter";
import { EnvSchema, InferEnv, ValidateEnvOptions } from "./types";
import { resolveEnvKey } from "./utils/envResolver";
import { parseValue } from "./validators";

dotenv.config();

export const validateEnv = <T extends EnvSchema>(
  schema: T,
  options?: ValidateEnvOptions,
): InferEnv<T> => {
  const errors: string[] = [];
  const result: Partial<InferEnv<T>> = {};

  const { strict, prefix, quiet, formatError } = options ?? {};

  if (strict) {
    checkUnknownKeys(schema, prefix);
  }

  for (const key in schema) {
    const rule = schema[key];
    const envKey = resolveEnvKey(key, prefix);
    const rawValue = process.env[envKey];

    if (!rawValue) {
      if (rule.required && rule.default === undefined) {
        errors.push(`${envKey} is required`);
        continue;
      }

      result[key as keyof T] = rule.default as InferEnv<T>[keyof T];
      continue;
    }

    try {
      result[key] = parseValue(rule, rawValue, envKey);
    } catch (error: unknown) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push(String(error));
      }
    }
  }
  if (errors.length && !quiet) {
    const message = formatError
      ? formatError(errors)
      : defaultErrorFormatter(errors);

    throw new Error(message);
  }

  return result as { [k in keyof T]: any };
};

const checkUnknownKeys = (schema: EnvSchema, prefix?: string) => {
  const schemaKeys = Object.keys(schema).map((k) =>
    prefix ? `${prefix}${k}` : k,
  );

  const envKeys = Object.keys(process.env);

  const unknownKeys = envKeys.filter((key) =>
    prefix
      ? key.startsWith(prefix) && !schemaKeys.includes(key)
      : !schemaKeys.includes(key),
  );

  if (unknownKeys.length) {
    throw new Error(`Unknown env veriables: ${unknownKeys.join(", ")}`);
  }
};
