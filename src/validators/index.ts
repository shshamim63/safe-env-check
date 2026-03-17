import { EnvRule, EnvTypeMap } from "../types";
import { booleanValidator } from "./boolean.validator";
import { enumValidator } from "./enum.validator";
import { numberValidator } from "./number.validator";
import { stringValidator } from "./string.validator";

export const parseValue = <T extends EnvRule>(
  rule: T,
  rawValue: string,
  envKey: string,
): EnvTypeMap[T["type"]] => {
  switch (rule.type) {
    case "string":
      return stringValidator(rawValue) as EnvTypeMap[T["type"]];

    case "number":
      return numberValidator(rawValue, envKey) as EnvTypeMap[T["type"]];

    case "boolean":
      return booleanValidator(rawValue, envKey) as EnvTypeMap[T["type"]];

    case "enum":
      return enumValidator(
        rule as EnvRule<"enum">,
        rawValue,
        envKey,
      ) as EnvTypeMap[T["type"]];

    default:
      throw new Error(`Unsupported type for ${envKey}`);
  }
};
