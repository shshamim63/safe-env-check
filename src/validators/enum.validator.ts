import { EnvRule, EnvTypeMap } from "../types";

export const enumValidator = (
  rule: EnvRule<"enum">,
  rawValue: string,
  envKey: string,
): EnvTypeMap["enum"] => {
  if (!rule.values.includes(rawValue)) {
    throw new Error(`${envKey} must be one of: ${rule.values.join(", ")}`);
  }
  return rawValue;
};
