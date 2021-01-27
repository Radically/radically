export function sum(a: number, b: number) {
  return a + b;
}

import fs from "fs";
import path from "path";

import {
  IDCSet,
  StrokePlaceholderSet,
  JSON_FILE_NAMES,
} from "../src/constants";

const utfstring = require("utfstring");

import {
  getAvailableIDSData,
  getAllResolvedIDSData,
} from "./unicode-ids-fetcher";

import { writeJSON } from "./writer";
// import { getRawIRGSources } from "./unihan-fetcher";

/* const processIDSText = (text: string) => {
  const forwardMap = {};
  let reverseMap = {}; // char:  { utf_code: U+0000, ids_strings: [{ids: decomp1, locales: 'GT'}, {ids: decomp2, locales: 'JK'}] }
  const baseRadicals = new Set();
  const metadata = {
    entries: 0,
    unique_radicals: 0,
    date: new Date(),
  };
  const split = text.split("\n");
}; */

const kangxiToCJKMap = new Map<String, String>();
{
  const rawKangxiToCJK = fs
    .readFileSync(path.join(__dirname, "utf-to-kangxi.csv"), "utf8")
    .split("\n");
  for (let entry of rawKangxiToCJK) {
    let split = entry.split(",");
    // @ts-ignore
    const kangxi = String.fromCodePoint(Number(split[1], 10));
    // @ts-ignore
    const cjk = String.fromCodePoint(Number(split[0], 10));
    kangxiToCJKMap.set(kangxi, cjk);
  }
}

export const kangxiToCJK = (input: string): string => {
  const output = [];
  let currentChar;
  for (let i = 0; i < utfstring.length(input); i++) {
    // there is a bug in utfstring.charAt at the time of writing
    currentChar = utfstring.fromCharCode(utfstring.charCodeAt(input, i));
    if (kangxiToCJKMap.has(currentChar)) {
      output.push(kangxiToCJKMap.get(currentChar));
    } else {
      output.push(currentChar);
    }
  }
  return output.join("");
};

const processIDSText = (resolvedIDSData: string[][]) => {
  const forwardMap: any = {};
  const reverseMap: ReverseMap = {};

  const baseRadicals = new Set<string>();

  const processedIDSMetadata = {
    entries: 0,
    unique_radicals: 0,
    date: new Date(),
  };

  for (let entry of resolvedIDSData) {
    processedIDSMetadata.entries += 1;
    const utfCp = entry[0];
    const char = entry[1];

    const reverseMapValue = [];

    for (let i = 2; i < entry.length; i++) {
      // it does appear that kawabata and glyphwiki do not use kangxi radicals,
      // where possible, but just in case
      entry[i] = kangxiToCJK(entry[i]);
      const localeStart = /[[][A-Z]+[\]]/.exec(entry[i]);
      const str =
        localeStart !== null ? entry[i].substr(0, localeStart.index) : entry[i];
      const locales = localeStart !== null ? localeStart[0] : null;

      /* const localeStart = entry[i].indexOf("[");
      const str = localeStart > -1 ? entry[i].substr(0, localeStart) : entry[i];
      const locales = localeStart > -1 ? entry[i].substr(localeStart) : null; */
      reverseMapValue.push({ ids: str, locales });

      // for (let i = 0; i < str.length; i++) {
      for (let i = 0; i < utfstring.length(str); i++) {
        // bug with utfstring
        // let radical = utfstring.charAt(str, i);
        let radical = utfstring.fromCharCode(utfstring.charCodeAt(str, i));
        if (IDCSet.has(radical)) continue;
        if (StrokePlaceholderSet.has(radical)) continue;
        // ignore all ascii
        if (radical.charCodeAt(0) < 127) continue;
        // add everything 1st
        baseRadicals.add(radical);
        if (radical === char) {
          /* e.g. U+27C28	𧰨	𧰨, there exists an entry where this radical
            can only be described by itself */

          /*if (entry.length === 3) {
            baseRadicals.add(radical);
            processedIDSMetadata.unique_radicals += 1;
          }*/
          continue;
        }

        if (!(radical in forwardMap)) {
          forwardMap[radical] = new Set();
        }
        forwardMap[radical].add(char);
      }
    }

    // unihan-fetcher simply concats all the entries in the different files
    // together, 𨘒 (U+28612) is both in
    // MANUALLY_RESOLVED_ and MANUALLY_PARTIALLY_RESOLVED_
    if (char in reverseMap) {
      reverseMap[char].ids_strings = reverseMap[char].ids_strings.concat(
        reverseMapValue
      );
    } else {
      reverseMap[char] = { utf_code: entry[0], ids_strings: reverseMapValue };
    }
  }

  // .... and remove all characters that have a decomposition later
  for (let entry of resolvedIDSData) {
    const utfCp = entry[0];
    const char = entry[1];
    if (entry[2] !== entry[1]) baseRadicals.delete(entry[1]);
  }

  processedIDSMetadata.unique_radicals = baseRadicals.size;

  // need to convert to an array because we can't stringify Sets apparently...
  for (let radical of Object.keys(forwardMap))
    forwardMap[radical] = Array.from(forwardMap[radical]);

  return { baseRadicals, forwardMap, reverseMap, processedIDSMetadata };
};

const main = async () => {
  // for testing purposes only
  // const IRGSourcesString = await getRawIRGSources();
  // console.log(IRGSourcesString.substring(0, 100));

  let resolvedIDSData: string[][] = [];
  for (let sourceFile of await getAvailableIDSData()) {
    resolvedIDSData = resolvedIDSData.concat(getAllResolvedIDSData(sourceFile));
  }

  const {
    baseRadicals,
    forwardMap,
    reverseMap,
    processedIDSMetadata,
  } = processIDSText(resolvedIDSData);

  // write to output
  writeJSON(
    JSON.stringify(Array.from(baseRadicals)),
    JSON_FILE_NAMES.baseRadicals
  );

  writeJSON(JSON.stringify(reverseMap), JSON_FILE_NAMES.reverseMap);

  writeJSON(JSON.stringify(forwardMap), JSON_FILE_NAMES.forwardMap);

  writeJSON(
    JSON.stringify(processedIDSMetadata),
    JSON_FILE_NAMES.processedIDSMetadata
  );
};

export default main;
