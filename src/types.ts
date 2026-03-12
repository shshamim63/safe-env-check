export type EnvType = "string" | "number" | "boolean" | "enum";

export type EnvTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  enum: string;
};

type EnvRuleBase<T extends EnvType> = {
  type: T;
  required?: boolean;
  default?: EnvTypeMap[T];
};

type StringEnvRule = EnvRuleBase<"string">;
type NumberEnvRule = EnvRuleBase<"number">;
type BooleanEnvRule = EnvRuleBase<"boolean">;
type EnumEnvRule = EnvRuleBase<"enum"> & {
  values: readonly string[];
};

export type EnvRule<T extends EnvType = EnvType> = T extends "string"
  ? StringEnvRule
  : T extends "number"
    ? NumberEnvRule
    : T extends "boolean"
      ? BooleanEnvRule
      : T extends "enum"
        ? EnumEnvRule
        : never;

export type EnvSchema = Record<string, EnvRule>;

export interface ValidateEnvOptions {
  strict?: boolean;
  prefix?: string;
  formatError?: (error: string[]) => string;
}

export type InferEnv<T extends EnvSchema> = {
  [K in keyof T]: T[K] extends { required: true }
    ? EnvTypeMap[T[K]["type"]]
    : T[K] extends { default: EnvTypeMap[T[K]["type"]] }
      ? EnvTypeMap[T[K]["type"]]
      : EnvTypeMap[T[K]["type"]] | undefined;
};
