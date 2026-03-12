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

const valueFlags = new Set(["--schema", "--env-file", "--prefix", "--format"]);

export const parseArgs = (args: string[]): CliOptions => {
  const options: CliOptions = {};

  const getArg = (flag: string) => {
    const index = args.indexOf(flag);
    const next = args[index + 1];
    return index !== -1 && next && !next.startsWith("--") ? next : undefined;
  };

  const hasFlag = (flag: string) => args.includes(flag);

  const positionalArgs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      if (valueFlags.has(arg)) {
        i++;
      }
      continue;
    }

    if (
      i === 0 ||
      !args[i - 1].startsWith("--") ||
      !valueFlags.has(args[i - 1])
    ) {
      positionalArgs.push(arg);
    }
  }

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
