import { EnvTypeMap } from "../types";

export const stringValidator = (rawValue: string): EnvTypeMap["string"] => {
  return rawValue;
};
