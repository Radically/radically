export function sum(a: number, b: number) {
  return a + b;
}

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
        // let radical = str.charAt(i);
        let radical = utfstring.charAt(str, i);
        if (IDCSet.has(radical)) continue;
        if (StrokePlaceholderSet.has(radical)) continue;
        if (radical === char) {
          /* e.g. U+27C28	𧰨	𧰨, there exists an entry where this radical
            can only be described by itself */

          /*if (entry.length === 3) {
            baseRadicals.add(radical);
            processedIDSMetadata.unique_radicals += 1;
          }*/
          continue;
        }

        // ignore all ascii
        if (radical.charCodeAt(0) < 127) continue;
        // add everything 1st
        baseRadicals.add(radical);
        if (!(radical in forwardMap)) {
          forwardMap[radical] = new Set();
        }
        forwardMap[radical].add(char);
      }
    }
    reverseMap[char] = { utf_code: entry[0], ids_strings: reverseMapValue };
  }

  for (let entry of resolvedIDSData) {
    const utfCp = entry[0];
    const char = entry[1];
    if (entry[2] !== entry[1]) baseRadicals.delete(entry[1]);
  }

  processedIDSMetadata.unique_radicals = baseRadicals.size;

  // need to convert to an array because we can't stringify Sets apparently...
  for (let radical of Object.keys(forwardMap))
    forwardMap[radical] = Array.from(forwardMap[radical]);
  // console.log(JSON.stringify(forwardMap));

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

const main = async () => {
  // for testing purposes only
  // const IRGSourcesString = await getRawIRGSources();
  // console.log(IRGSourcesString.substring(0, 100));

  let resolvedIDSData: string[][] = [];
  for (let sourceFile of await getAvailableIDSData()) {
    resolvedIDSData = resolvedIDSData.concat(getAllResolvedIDSData(sourceFile));
  }

  processIDSText(resolvedIDSData);
};

export default main;
