export const defaultErrorFormatter = (errors: string[]) => {
  return (
    "❌ Environment validation failed:\n" +
    errors.map((e) => `- ${e}`).join("\n")
  );
};

export const jsonErrorFormatter = (errors: string[]) =>
  JSON.stringify({ errors }, null, 2);
