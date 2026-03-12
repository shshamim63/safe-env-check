import { EnvTypeMap } from "../types";

export const booleanValidator = (
  rawValue: string,
  envKey: string,
): EnvTypeMap["boolean"] => {
  if (rawValue === "true") return true;
  if (rawValue === "false") return false;
  throw new Error(`${envKey} must be a boolean`);
};
