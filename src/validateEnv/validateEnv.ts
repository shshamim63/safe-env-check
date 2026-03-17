import dotenv from "dotenv";

import { defaultErrorFormatter } from "../errors/errorFormatter";
import { EnvSchema, InferEnv, ValidateEnvOptions } from "../types";
import { resolveEnvKey } from "../utils/envResolver";
import { parseValue } from "../validators";
import { checkUnknownKeys } from "./checkUnknownKeys";

export const validateEnv = <T extends EnvSchema>(
  schema: T,
  options?: ValidateEnvOptions,
): InferEnv<T> => {
  const errors: string[] = [];
  const result: Partial<InferEnv<T>> = {};

  const { strict, prefix, formatError, envFile = ".env" } = options ?? {};

  dotenv.config({ path: envFile });

  if (strict) {
    errors.push(...checkUnknownKeys(schema, envFile, prefix));
  }

  for (const key in schema) {
    const rule = schema[key];
    const envKey = resolveEnvKey(key, prefix);
    const rawValue = process.env[envKey];

    if (rawValue === undefined) {
      if (rule.required && rule.default === undefined) {
        errors.push(`${envKey} is required`);
        continue;
      }

      result[key as keyof T] = rule.default as InferEnv<T>[keyof T];
      continue;
    }

    try {
      result[key as keyof T] = parseValue(rule, rawValue, envKey);
    } catch (error: unknown) {
      if (error instanceof Error) {
        errors.push(error.message);
      } else {
        errors.push(String(error));
      }
    }
  }

  if (errors.length) {
    const message = formatError
      ? formatError(errors)
      : defaultErrorFormatter(errors);

    throw new Error(message);
  }

  return result as InferEnv<T>;
};
