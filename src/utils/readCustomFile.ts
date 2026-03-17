import fs from "fs";
import dotenv from "dotenv";

export const readEnvFile = (envFile: string) => {
  try {
    const file = fs.readFileSync(envFile);
    return dotenv.parse(file);
  } catch (error) {
    return {};
  }
};
