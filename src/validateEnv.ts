import { EnvSchema, ValidateEnvOptions } from "./types";

export const validateEnv = <T extends EnvSchema>(
  schema: T,
  options: ValidateEnvOptions = {},
): { [K in keyof T]: any } => {
  const errors: string[] = [];
  const result: any = {};

  if (options.strict) {
    const schemaKeys = Object.keys(schema);
    const envKeys = Object.keys(process.env);

    const unknownKeys = envKeys.filter((key) => !schemaKeys.includes(key));

    if (unknownKeys.length)
      errors.push(`Unknown evn variables: ${unknownKeys.join(", ")}`);
  }

  for (const key in schema) {
    const rule = schema[key];
    const rawValue = process.env[key];

    if (!rawValue) {
      if (rule.required && rule.default === undefined) {
        errors.push(`${key} is required`);
        continue;
      }
      result[key] = rule.default;
      continue;
    }

    switch (rule.type) {
      case "string":
        result[key] = rawValue;
        break;

      case "number":
        const num = Number(rawValue);
        if (isNaN(num)) errors.push(`${key} must be a number`);
        else result[key] = num;
        break;

      case "boolean":
        result[key] = rawValue === "true";
        break;

      case "enum":
        if (!rule.values.includes(rawValue)) {
          errors.push(`${key} must be one of: ${rule.values.join(", ")}`);
        } else {
          result[key] = rawValue;
        }
        break;
    }
  }

  if (errors.length) {
    const message = options.formatError
      ? options.formatError(errors)
      : defaultErrorFormatter(errors);

    throw new Error(message);
  }

  return result;
};

const defaultErrorFormatter = (errors: string[]) => {
  return (
    "❌ Environment validation failed:\n" +
    errors.map((e) => `- ${e}`).join("\n")
  );
};
