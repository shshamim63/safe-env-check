import dotenv from "dotenv";
import fs from "fs";

import { readEnvFile } from "../../src/utils/readCustomFile";

jest.mock("dotenv", () => ({
  parse: jest.fn(),
}));

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

describe("readEnvFile", () => {
  test("should read and parse env file", () => {
    const envContent = Buffer.from("PORT=3000\nNODE_ENV=production");
    const envFile = ".env";
    jest.spyOn(fs, "readFileSync").mockReturnValue(envContent);
    jest.spyOn(dotenv, "parse").mockReturnValue({
      PORT: "3000",
      NODE_ENV: "production",
    });
    const result = readEnvFile(envFile);
    expect(fs.readFileSync).toHaveBeenCalledWith(envFile);
    expect(result).toEqual({
      PORT: "3000",
      NODE_ENV: "production",
    });
  });

  test("should return empty object if file does not exist", () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      throw new Error("File not found");
    });
    const result = readEnvFile(".env.production");
    expect(result).toEqual({});
  });
});
