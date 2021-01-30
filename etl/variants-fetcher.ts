import fs from "fs";
import path from "path";

import {
  CJKVI_VARIANTS_SUBDIR_NAME,
  MANUAL_CJKVI_VARIANTS_SUBDIR_NAME,
} from "./constants";

const utfstring = require("utfstring");

const CJKVI_VARIANTS_SUBDIR = path.join(__dirname, CJKVI_VARIANTS_SUBDIR_NAME);

const MANUAL_CJKVI_VARIANTS_SUBDIR = path.join(
  __dirname,
  MANUAL_CJKVI_VARIANTS_SUBDIR_NAME
);

export const getAvailableVariantsData = (): string[] => {
  return fs.readdirSync(CJKVI_VARIANTS_SUBDIR);
};

export const getRawVariantsData = (
  originalFileName: string
): string[][] | null => {
  const filePath = path.join(CJKVI_VARIANTS_SUBDIR, originalFileName);
  let res = [] as string[][];
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const split = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let entry of split) {
    if (!entry.length) continue;
    if (entry.trim().startsWith("#")) continue;
    if (entry.charCodeAt(0) < 127) continue;
    // found a \r at the end of a string in the wild
    res.push(entry.split(",").map((s) => s.trim()));
  }

  const rawManualVariants = getRawManualVariantsData(originalFileName);

  if (rawManualVariants !== null) {
    res = res.concat(rawManualVariants);
  }

  return res;
};

const getRawManualVariantsData = (
  originalFileName: string
): string[][] | null => {
  const filePath = path.join(MANUAL_CJKVI_VARIANTS_SUBDIR, originalFileName);
  const res = [] as string[][];
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const split = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let entry of split) {
    if (!entry.length) continue;
    if (entry.trim().startsWith("#")) continue;
    if (entry.charCodeAt(0) < 127) continue;
    res.push(entry.split(","));
  }

  return res;
};

export const getJPOldStyleData = () => {
  const filePath = path.join(CJKVI_VARIANTS_SUBDIR, "jp-old-style.txt");
  const res = [] as string[][];

  const split = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let entry of split) {
    if (!entry.length) continue;
    if (entry.trim().startsWith("#")) continue;
    res.push(entry.split("\t"));
  }

  return res;
};

export const getCommonTraditionalCharacters = (): string[] => {
  const filePath = path.join(__dirname, "cj5-tc-sourced.txt");
  const res = [] as string[];
  const split = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let entry of split) {
    if (!entry.length) continue;
    if (entry.trim().startsWith("#")) continue;
    const splitEntry = entry.split(" ");
    res.push(splitEntry[splitEntry.length - 1]);
  }
  return res;
};

export const getCommonSimplifiedCharacters = (): string[] => {
  const filePath = path.join(__dirname, "cj5-sc-sourced.txt");
  const res = [] as string[];
  const split = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let entry of split) {
    if (!entry.length) continue;
    if (entry.trim().startsWith("#")) continue;
    const splitEntry = entry.split(" ");
    res.push(splitEntry[splitEntry.length - 1]);
  }
  return res;
};

export const getOrthographicVariantsPerCharacter = (
  ivsInstance: any
): {
  [key: string]: Set<string>;
} => {
  const map = {} as {
    [key: string]: Set<string>;
  };
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<string>();
    }
  };

  {
    const data = getRawVariantsData("numeric-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("cjkvi-simplified.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("hydzd-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      if (entry[1] === "hydzd/variant") continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("joyo-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("hyogai-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("radical-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("jisx0212-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("jisx0213-variants.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getRawVariantsData("jp-borrowed.txt");
    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getJPOldStyleData();
    for (let entry of data) {
      entry = entry.map((s) => ivsInstance.strip(s));
      if (entry.length === 2 || entry.length === 3) {
        entry.map(createMapEntry);
        map[entry[0]].add(entry[1]);
        map[entry[1]].add(entry[0]);

        if (entry.length === 3) {
          map[entry[0]].add(entry[2]);
          map[entry[2]].add(entry[0]);
          map[entry[1]].add(entry[2]);
          map[entry[2]].add(entry[1]);
        }
      }
    }
  }
  return map;
};

export const getAllVariantsPerCharacter = (
  ivsInstance: any
): {
  [key: string]: Set<string>;
} => {
  const map = {} as {
    [key: string]: Set<string>;
  };
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<string>();
    }
  };

  for (let filename of getAvailableVariantsData()) {
    // this file doesn't adhere the char1,mapping/type,char2 format
    // handle below
    if (filename === "jp-old-style.txt") continue;

    // don't include 通假字, the ancients made substitutions such
    // as 示 for 視, 不亦說(樂)乎?
    if (filename === "hydzd-borrowed.txt") continue;

    // sawndip is semantically different
    if (filename === "sawndip-variants.txt") continue;

    const data = getRawVariantsData(filename);

    for (let entry of data) {
      // just in case
      if (entry[0] === entry[2]) continue;
      if (utfstring.length(entry[2]) !== 1) continue;
      createMapEntry(entry[0]);
      createMapEntry(entry[2]);
      map[entry[0]].add(entry[2]);
      map[entry[2]].add(entry[0]);
    }
  }

  {
    const data = getJPOldStyleData();
    for (let entry of data) {
      entry = entry.map((s) => ivsInstance.strip(s));
      if (entry.length === 2 || entry.length === 3) {
        entry.map(createMapEntry);
        map[entry[0]].add(entry[1]);
        map[entry[1]].add(entry[0]);

        if (entry.length === 3) {
          map[entry[0]].add(entry[2]);
          map[entry[2]].add(entry[0]);
          map[entry[1]].add(entry[2]);
          map[entry[2]].add(entry[1]);
        }
      }
    }
  }

  return map;
};
