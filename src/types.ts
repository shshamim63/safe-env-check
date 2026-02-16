export type EnvField =
  | { type: "string"; required?: boolean; default?: string }
  | { type: "number"; required?: boolean; default?: number }
  | { type: "boolean"; required?: boolean; default?: boolean }
  | {
      type: "enum";
      values: readonly string[];
      required?: boolean;
      default?: string;
    };

export type EnvSchema = Record<string, EnvField>;

export interface ValidateEnvOptions {
  strict?: boolean;
  formatError?: (error: string[]) => string;
}
