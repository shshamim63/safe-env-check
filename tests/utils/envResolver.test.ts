import fs from "fs";

import { resolveEnvKey } from "../../src/utils/envResolver";

describe("Env keys util", () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("resolveEnvKey", () => {
    const prefix = "PROD_";
    const key = "PORT";
    test("should return key concataning with the prefix", () => {
      const prefix = "PROD_";
      const key = "PORT";
      expect(resolveEnvKey(key, prefix)).toEqual(prefix.concat(key));
    });

    test("should return only the key when prefix does not exist", () => {
      expect(resolveEnvKey(key)).toEqual(key);
    });
  });
});
