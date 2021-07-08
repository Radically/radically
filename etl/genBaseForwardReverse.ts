import fs from "fs";
import path from "path";
// import pako from "pako";

import { isPUA, isValidIDS, structuredClone } from "./utils";

import {
  IDCSet,
  StrokePlaceholderSet,
  JSON_FILE_NAMES,
  // PAKO_FILE_NAMES,
  // PROTOBUF_FILE_NAMES,
  // REVERSE_MAP_PROTOBUF_DESCRIPTOR,
} from "../src/constants";

const utfstring = require("utfstring");

import {
  getAvailableIDSData,
  getAllResolvedIDSData,
  getAllPartiallyResolvedIDSData,
} from "./unicode-ids-fetcher";

import {
  writeJSON,
  //  writeData, writeReverseMapProtobuf
} from "./writer";
import { getPUAData } from "./babelstone-pua-fetcher";
// import protobuf from "protobufjs";
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

// type powerset = {
//   [key: string]: number;
// };

export const mergeTwoFreqs = (freqsA: powerset, freqsB: powerset): powerset => {
  const res = { ...freqsB };
  for (let char of Object.keys(freqsA)) {
    if (!res[char]) res[char] = 0;
    res[char] += freqsA[char];
  }
  return res;
};

export const freqPerm = (freqsArr: powerset[][]): powerset[] => {
  // freqsArr is [ [ {char: 99}, {char2, 99}, ...] ]

  const lengths = freqsArr.map((arr) => arr.length);

  let res = [] as number[][];
  /*
  [
  [ 0, 0, 0 ], [ 0, 0, 1 ],
  [ 0, 0, 2 ], [ 0, 1, 0 ],
  [ 0, 1, 1 ], [ 0, 1, 2 ],
  [ 1, 0, 0 ], [ 1, 0, 1 ],
  [ 1, 0, 2 ], [ 1, 1, 0 ],
  [ 1, 1, 1 ], [ 1, 1, 2 ]
  ]*/
  let tmp = [] as number[];

  const rec = (idx: number) => {
    if (idx === lengths.length) {
      res.push([...tmp]);
    } else {
      for (let i = 0; i < lengths[idx]; i++) {
        tmp.push(i);
        rec(idx + 1);
        tmp.pop();
      }
    }
  };
  rec(0);

  const ans = [] as powerset[];
  for (let permIdArr of res) {
    let res = {};
    const perm = permIdArr.map((elem: number, i: number) => freqsArr[i][elem]);
    for (let item of perm) {
      res = mergeTwoFreqs(res, item);
    }
    ans.push(res);
  }
  return ans;
};

export const rec = (reverseMap: ReverseMap, char: string, encountered: Set<String>): powerset[] => {
  const freqsAtThisNode = [] as { [key: string]: number }[]; // it is *not* a powerset!

  if (!(char in reverseMap) || 
    encountered.has(char)) { // avoid cycles!
    return [{}];
  }

  encountered.add(char);

  const { ids_strings } = reverseMap[char];

  for (let i = 0; i < ids_strings.length; i++) {
    freqsAtThisNode.push({});
    const { ids } = ids_strings[i];

    let idsChar: string;
    for (let j = 0; j < utfstring.length(ids); j++) {
      idsChar = utfstring.fromCharCode(utfstring.charCodeAt(ids, j));

      // TODO: refactor this into a function
      if (IDCSet.has(idsChar)) continue;
      if (StrokePlaceholderSet.has(idsChar)) continue;
      // ignore all ascii
      if (idsChar.charCodeAt(0) < 127) continue;
      if (idsChar === "？") continue;

      if (!IDCSet.has(idsChar) && idsChar !== char) {
        if (!freqsAtThisNode[i][idsChar]) freqsAtThisNode[i][idsChar] = 0;
        freqsAtThisNode[i][idsChar] += 1;
      }
    }

    /* for (let idsChar of ids) {
      if (!IDCSet.has(idsChar) && idsChar !== char) {
        if (!freqsAtThisNode[i][idsChar]) freqsAtThisNode[i][idsChar] = 0;
        freqsAtThisNode[i][idsChar] += 1;
      }
    }*/
  }

  let res = [] as powerset[];
  for (let i = 0; i < freqsAtThisNode.length; i++) {
    let freqs = freqPerm(
      Object.keys(freqsAtThisNode[i]).map((key) => {
        const powersets = rec(reverseMap, key, new Set(encountered)) as powerset[];
        for (let powerset of powersets) {
          for (let component in powerset) {
            powerset[component] *= freqsAtThisNode[i][key];
          }
        }
        return powersets;
      })
    );
    freqs = freqs.map((freq) => mergeTwoFreqs(freq, freqsAtThisNode[i]));
    res = res.concat(freqs);
  }

  return res;
};

const finalizeReverseMap = (reverseMap: ReverseMap) => {
  for (let char of Object.keys(reverseMap)) {
    reverseMap[char].charFreqs = rec(reverseMap, char, new Set());
  }
};

const processIDSEntries = (idsEntries: IDSEntries, forwardMap: any, reverseMap: ReverseMap, baseRadicals: Set<String>) => {
  for (let entry of idsEntries) {
    const utfCp = entry[0];
    const char = entry[1];

    // add everything first
    baseRadicals.add(char);

    if (!char) continue;

    let reverseMapValue = [] as { ids: string, locales: string }[];

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
        if (radical === "？") continue;
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

    reverseMapValue = reverseMapValue.filter(({ids}) => isValidIDS(ids));
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
}

const processIDSText = (resolvedIDSData: IDSEntries, partiallyResolvedIDSData: IDSEntries) => {
  const forwardMap: any = {};
  const reverseMap: ReverseMap = {};

  const baseRadicals = new Set<string>();

  const processedIDSMetadata = {
    entries: 0,
    pua_entries: 0,
    unique_radicals: 0,
    date: new Date(),
  };

  processIDSEntries(resolvedIDSData, forwardMap, reverseMap, baseRadicals);
  processIDSEntries(partiallyResolvedIDSData, forwardMap, reverseMap, baseRadicals);

  for (let char of Object.keys(reverseMap)) {
    if (char && isPUA(char)) processedIDSMetadata.pua_entries += 1;
    else processedIDSMetadata.entries += 1;
  }

  // .... and remove all characters that have a decomposition later
  for (let entry of resolvedIDSData) {
    const utfCp = entry[0];
    const char = entry[1];
    // if (entry[2] !== entry[1]) baseRadicals.delete(entry[1]);
    if (entry.slice(2).some(ids => ids !== entry[1])) baseRadicals.delete(entry[1]);
  }

  processedIDSMetadata.unique_radicals = baseRadicals.size;

  // need to convert to an array because we can't stringify Sets apparently...
  for (let radical of Object.keys(forwardMap))
    forwardMap[radical] = Array.from(forwardMap[radical]);

  finalizeReverseMap(reverseMap);
  return {
    baseRadicals,
    forwardMap: forwardMap as ForwardMap,
    reverseMap,
    processedIDSMetadata,
  };
};

const getCharFreqs = (reverseMap: ReverseMap): ReverseMapCharOnly => {
  function isObjectEmpty(obj: Object) {
    return (
      obj && // 👈 null and undefined check
      Object.keys(obj).length === 0 &&
      obj.constructor === Object
    );
  }

  const withoutSingleOccurrences = {} as {
    [key: string]: { [key: string]: number }[];
  };
  for (let char in reverseMap) {
    withoutSingleOccurrences[char] = reverseMap[char].charFreqs;

    for (let pset of withoutSingleOccurrences[char]) {
      for (let radical of Object.keys(pset)) {
        // @ts-ignore
        if (pset[radical] === 1) {
          // @ts-ignore
          delete pset[radical];
        }
      }
    }
    withoutSingleOccurrences[char] = withoutSingleOccurrences[char].filter(
      (x) => !isObjectEmpty(x)
    );
  }

  for (let char of Object.keys(withoutSingleOccurrences)) {
    if (withoutSingleOccurrences[char].length === 0) {
      delete withoutSingleOccurrences[char];
    }
  }

  const res = {} as ReverseMapCharOnly;
  for (let char of Object.keys(withoutSingleOccurrences)) {
    const unified = {} as { [key: string]: number };

    for (let strippedPset of withoutSingleOccurrences[char]) {
      for (let comp in strippedPset) {
        if (!(comp in unified)) {
          unified[comp] = strippedPset[comp];
        } else {
          unified[comp] = Math.max(unified[comp], strippedPset[comp]);
        }
      }
    }

    res[char] = unified;
  }

  return res;
};

const getIDS = (reverseMap: ReverseMap): ReverseMapIDSOnly => {
  const res = {} as ReverseMapIDSOnly;
  for (let char in reverseMap) {
    res[char] = reverseMap[char].ids_strings.map(({ ids, locales }) => ({
      i: ids,
      l: locales,
    }));
  }

  return res;
};

const main = async () => {
  // for testing purposes only
  // const IRGSourcesString = await getRawIRGSources();
  // console.log(IRGSourcesString.substring(0, 100));

  let resolvedIDSData: IDSEntries = [];
  for (let sourceFile of await getAvailableIDSData()) {
    console.log(sourceFile);
    resolvedIDSData = resolvedIDSData.concat(getAllResolvedIDSData(sourceFile));
  }

  let partiallyResolvedIDSData: IDSEntries = [];
  for (let sourceFile of await getAvailableIDSData()) {
    partiallyResolvedIDSData = partiallyResolvedIDSData.concat(getAllPartiallyResolvedIDSData(sourceFile));
  }

  const babelstonePUAData = await getPUAData();

  for (let pua of babelstonePUAData.data) {
    const entry = [pua.cp, pua.char, pua.ids];
    resolvedIDSData.push(entry);
  }

  const {
    baseRadicals,
    forwardMap,
    reverseMap,
    processedIDSMetadata,
  } = processIDSText(resolvedIDSData, partiallyResolvedIDSData);

  // write to output
  writeJSON(
    JSON.stringify(Array.from(baseRadicals)),
    JSON_FILE_NAMES.baseRadicals
  );

  /* const pbufReverseMap = {
    data: structuredClone(reverseMap),
  } as any;

  for (let char in pbufReverseMap.data) {
    pbufReverseMap.data[char].charFreqs = pbufReverseMap.data[
      char
    ].charFreqs.map((m: powerset) => ({
      m,
    }));
  }

  writeData(
    pako.deflate(JSON.stringify(reverseMap)),
    PAKO_FILE_NAMES.reverseMap
  ); 

  const root = protobuf.Root.fromJSON(REVERSE_MAP_PROTOBUF_DESCRIPTOR);
  const ReverseMap = root.lookupType("ReverseMap");
  const PakoedPbufedReverseMap = pako.deflateRaw(
    ReverseMap.encode(pbufReverseMap).finish()
  );

  writeReverseMapProtobuf(
    PakoedPbufedReverseMap,
    PROTOBUF_FILE_NAMES.reverseMap
  ); */

  // actually modifies reversemap, hence structuredClone
  writeJSON(JSON.stringify(reverseMap), JSON_FILE_NAMES.reverseMap);
  writeJSON(
    JSON.stringify(getCharFreqs(structuredClone(reverseMap))),
    JSON_FILE_NAMES.reverseMapCharFreqsOnly
  );

  writeJSON(
    JSON.stringify(getIDS(structuredClone(reverseMap))),
    JSON_FILE_NAMES.reverseMapIDSOnly
  );

  writeJSON(JSON.stringify(forwardMap), JSON_FILE_NAMES.forwardMap);

  writeJSON(
    JSON.stringify(processedIDSMetadata),
    JSON_FILE_NAMES.processedIDSMetadata
  );
};

export default main;
