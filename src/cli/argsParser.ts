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
    return index !== -1 ? args[index + 1] : undefined;
  };

  const hasFlag = (flag: string) => args.includes(flag);

  const positionalArgs = args.filter(
    (arg, i) => !arg.startsWith("--") && !args[i - 1]?.startsWith("--"),
  );

  options.schemaFile = getArg("--schema") || positionalArgs[0];
  options.envFile = getArg("--env-file");
  options.prefix = getArg("--prefix");
  options.format = getArg("--format") as "json";
  options.strict = hasFlag("--strict");
  options.quiet = hasFlag("--quiet");
  options.help = hasFlag("--help");
  options.version = hasFlag("--version");

  return options;
};
