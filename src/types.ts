export type EnvType = "string" | "number" | "boolean" | "enum";

export type EnvTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  enum: string;
};

export type EnvRule<T extends EnvType = EnvType> = {
  type: T;
  required?: boolean;
  default?: EnvTypeMap[T];
} & (T extends "enum" ? { values: readonly string[] } : {});

export type EnvSchema = Record<string, EnvRule>;

export interface ValidateEnvOptions {
  strict?: boolean;
  prefix?: string;
  quiet?: boolean;
  formatError?: (error: string[]) => string;
}

export type InferEnv<T extends EnvSchema> = {
  [K in keyof T]: EnvTypeMap[T[K]["type"]];
};
