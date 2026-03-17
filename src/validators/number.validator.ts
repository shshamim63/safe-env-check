import { EnvTypeMap } from "../types";

export const numberValidator = (
  rawValue: string,
  envKey: string,
): EnvTypeMap["number"] => {
  const num = Number(rawValue);
  if (isNaN(num)) {
    throw new Error(`${envKey} must be a number`);
  }
  return num;
};
