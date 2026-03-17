export const resolveEnvKey = (key: string, prefix?: string): string => {
  return prefix ? `${prefix}${key}` : key;
};
