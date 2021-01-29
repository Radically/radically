import { getRawIRGSources } from "./unihan-fetcher";
import { writeJSON } from "./writer";

import { JSON_FILE_NAMES } from "../src/constants";

import {
  getRawVariantsData,
  getJPOldStyleData,
  getCommonTraditionalCharacters,
} from "./variants-fetcher";

import { Hanja as everydayHanja1800 } from "./hanja-for-everyday-use-1800.json";

const IVS = require("ivs");
const utfstring = require("utfstring");

const addChinese = (map: { [key: string]: Set<number> }) => {
  const cjkvi_simplified = getRawVariantsData("cjkvi-simplified.txt");

  const commonTraditional = getCommonTraditionalCharacters();

  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  for (let char of commonTraditional) {
    createMapEntry(char);
    map[char].add(CharacterVariant.chinese_traditional);
  }

  const cjkvi_simp_to_trad = new Map<string, string>();
  const cjkvi_trad_to_simp = new Map<string, string>();

  for (let entry of cjkvi_simplified) {
    if (
      entry[1] === "cjkvi/simplified" ||
      entry[1] === "cjkvi/variant-simplified"
    ) {
      /* "traditional" characters are assumed to be
      anything that isn't simplified
      㽞,cjkvi/simplified,留
      㽞 is a variant character that doesn't fit neatly
      into our categories */
      if (utfstring.length(entry[2]) === 1) {
        cjkvi_trad_to_simp.set(entry[0], entry[2]);
      }
    } else if (entry[1] === "cjkvi/pseudo-simplified") {
      if (utfstring.length(entry[2]) === 1) {
        createMapEntry(entry[2]);
        map[entry[2]].add(CharacterVariant.other_simplified);
      }
    } else if (entry[1] === "cjkvi/traditional") {
      if (utfstring.length(entry[2]) === 1) {
        cjkvi_simp_to_trad.set(entry[0], entry[2]);
      }
    }
  }

  // only if the mapping is bidirectional
  for (let [key, val] of cjkvi_simp_to_trad.entries()) {
    if (cjkvi_trad_to_simp.has(val)) {
      createMapEntry(key);
      map[key].add(CharacterVariant.chinese_simplified);
      createMapEntry(val);
      map[val].add(CharacterVariant.chinese_traditional);
    }
  }

  /* hydzd is probably a strict subset... 𫢟 is in cjkvi-simplified but not in hydzd, TODO: investigate */
};

export const addJapaneseShinKyu = (ivsInstance: any, map: VariantsMap) => {
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  const jp_old_style = getJPOldStyleData();
  for (let entry of jp_old_style) {
    entry = entry.map((s) => ivsInstance.strip(s));
    if (entry.length === 2 || entry.length === 3) {
      entry.map(createMapEntry);
      map[entry[0]].add(CharacterVariant.japanese_shinjitai);
      map[entry[1]].add(CharacterVariant.japanese_kyujitai);

      if (entry.length === 3) {
        map[entry[2]].add(CharacterVariant.other_japanese);
      }
    }
  }
};

export const addKoreanStandard = (map: VariantsMap) => {
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  for (let { Character } of everydayHanja1800) {
    createMapEntry(Character);
    map[Character].add(CharacterVariant.korean_standard);
  }
};

export const addKokuji = async (map: VariantsMap) => {
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  const IRGSourcesString = await getRawIRGSources();
  for (let entry of IRGSourcesString.split("\n")) {
    if (entry.startsWith("#")) continue;
    if (!entry) continue;
    // U+2A708	kIRG_JSource	JK-65004
    const split = entry.split("\t");
    if (split[1] === "kIRG_JSource" && split[2].startsWith("JK")) {
      const kokuji = String.fromCodePoint(parseInt(split[0].substr(2), 16));
      createMapEntry(kokuji);
      map[kokuji].add(CharacterVariant.kokuji);
    }
  }
};

const addJoyoKanji = async (map: VariantsMap) => {
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  const joyo_variants = getRawVariantsData("joyo-variants.txt");
  for (let entry of joyo_variants) {
    createMapEntry(entry[0]);
    map[entry[0]].add(CharacterVariant.joyo_kanji);
  }
};

const addKakikae = async (map: VariantsMap) => {
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  const kakikae_variants = getRawVariantsData("jp-borrowed.txt");
  for (let entry of kakikae_variants) {
    createMapEntry(entry[2]);
    map[entry[2]].add(CharacterVariant.kakikae);
  }
};

const main = async () => {
  /* generate a list of known variants first, e.g. whether a 
  character is a known radical, joyo kanji, simplified character, gukja, etc.*/
  // const IRGSourcesString = (await getRawIRGSources()).split("\n");
  // probably more efficient to assign a list to each character instead of doing an O(number of variants) lookup in the frontend for every single character...

  const map = {} as VariantsMap;
  addKakikae(map);
  addJoyoKanji(map);
  await addKokuji(map);
  addKoreanStandard(map);
  addChinese(map);
  // jp-old-style.txt makes use of IVS characters which I strip
  const ivs = new IVS(() => {
    addJapaneseShinKyu(ivs, map);
  });
};

export default main;
