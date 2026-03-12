export interface CliOptions {
  schemaFile?: string;
  envFile?: string;
  strict?: boolean;
  quiet?: boolean;
  format?: "json";
  prefix?: string;
  help?: boolean;
  version?: boolean;
}

export const parseArgs = (args: string[]): CliOptions => {
  const options: CliOptions = {};

  const getArg = (flag: string) => {
    const index = args.indexOf(flag);

    if (index === -1) return undefined;

    const next = args[index + 1];

    if (!next || next.startsWith("--")) return undefined;

    return next;
  };

  const hasFlag = (flag: string) => args.includes(flag);

  const positionalArgs = args.filter(
    (arg, i) => !arg.startsWith("--") && !args[i - 1]?.startsWith("--"),
  );

  options.schemaFile = getArg("--schema") || positionalArgs[0];
  options.envFile = getArg("--env-file");
  options.prefix = getArg("--prefix");
  options.format = getArg("--format") === "json" ? "json" : undefined;
  options.strict = hasFlag("--strict");
  options.quiet = hasFlag("--quiet");
  options.help = hasFlag("--help");
  options.version = hasFlag("--version");

  return options;
};
