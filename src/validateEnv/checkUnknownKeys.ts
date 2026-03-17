import { EnvSchema } from "../types";
import { readEnvFile } from "../utils/readCustomFile";

export const checkUnknownKeys = (
  schema: EnvSchema,
  envFile: string,
  prefix?: string,
) => {
  const schemaKeys = Object.keys(schema).map((k) =>
    prefix ? `${prefix}${k}` : k,
  );

  const envVars = readEnvFile(envFile);
  const envKeys = Object.keys(envVars);

  const unknownKeys = envKeys.filter((key) =>
    prefix
      ? key.startsWith(prefix) && !schemaKeys.includes(key)
      : !schemaKeys.includes(key),
  );

  if (unknownKeys.length) {
    return [`Unknown env variables: ${unknownKeys.join(", ")}`];
  }

  return [];
};
