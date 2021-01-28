import fs from "fs";
import path from "path";

import { CJKVI_VARIANTS_SUBDIR_NAME } from "./constants";

const CJKVI_VARIANTS_SUBDIR = path.join(__dirname, CJKVI_VARIANTS_SUBDIR_NAME);

export const getAvailableVariantsData = (): string[] => {
  return fs.readdirSync(CJKVI_VARIANTS_SUBDIR);
};

export const getRawVariantsData = (
  originalFileName: string
): string[][] | null => {
  const filePath = path.join(CJKVI_VARIANTS_SUBDIR, originalFileName);
  const res = [] as string[][];
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const split = fs.readFileSync(filePath, "utf-8").split("\n");
  for (let entry of split) {
    if (!entry.length) continue;
    if (entry.trim().startsWith("#")) continue;
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
    res.push(splitEntry[1]);
  }
  return res;
};
