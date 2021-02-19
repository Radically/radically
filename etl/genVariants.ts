import { getRawIRGSources } from "./unihan-fetcher";
import { writeJSON } from "./writer";

import { JSON_FILE_NAMES } from "../src/constants";

import { structuredClone } from "./utils";

import { CharacterVariant, CharacterVariantLocale } from "../src/types/common";

import {
  getRawVariantsData,
  getJPOldStyleData,
  getCommonTraditionalCharacters,
  getCommonSimplifiedCharacters,
  getAllVariantsPerCharacter,
  getOrthographicVariantsPerCharacter,
  getKawabataJoyoKanji,
} from "./variants-fetcher";

import { Hanja as everydayHanja1800 } from "./hanja-for-everyday-use-1800.json";

const IVS = require("ivs");
const utfstring = require("utfstring");

type VariantsSet = {
  [key: string]: Set<number>;
};

const addChinese = (map: VariantsSet) => {
  const cjkvi_simplified = getRawVariantsData("cjkvi-simplified.txt");

  const commonTraditional = getCommonTraditionalCharacters();
  const commonSimplified = getCommonSimplifiedCharacters();

  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  for (let char of commonTraditional) {
    createMapEntry(char);
    map[char].add(CharacterVariant.chinese_traditional);
  }

  for (let char of commonSimplified) {
    createMapEntry(char);
    map[char].add(CharacterVariant.chinese_simplified);
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

export const addJapaneseShinKyu = (ivsInstance: any, map: VariantsSet) => {
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

export const addKoreanStandard = (map: VariantsSet) => {
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

export const addKokuji = async (map: VariantsSet) => {
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

const addJoyoKanji = async (map: VariantsSet) => {
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

  const kawabata_joyo_table = getKawabataJoyoKanji();
  for (let char of kawabata_joyo_table) {
    createMapEntry(char);
    map[char].add(CharacterVariant.joyo_kanji);
  }
};

const addKakikae = async (map: VariantsSet) => {
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

const addSawndip = async (map: VariantsSet) => {
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
    if (
      split[1] === "kIRG_GSource" &&
      (split[2].startsWith("GZ-") ||
        split[2].startsWith("GLGYJ-") ||
        split[2].startsWith("GPGLG-"))
    ) {
      const sawndip = String.fromCodePoint(parseInt(split[0].substr(2), 16));
      createMapEntry(sawndip);
      map[sawndip].add(CharacterVariant.sawndip);
    }
  }
};

const addRadicals = (map: VariantsSet) => {
  const createMapEntry = (char: string) => {
    if (!(char in map)) {
      map[char] = new Set<number>();
    }
  };

  const radical_variants = getRawVariantsData("radical-variants.txt");

  for (let entry of radical_variants) {
    if (utfstring.length(entry[2]) > 1) continue;
    createMapEntry(entry[2]);
    map[entry[2]].add(CharacterVariant.radical);
  }
};

export const generateVariantIslands = (inputMap: {
  [key: string]: Set<string>;
}) => {
  const chars = Object.keys(inputMap);
  const visitedChars = new Set<string>();

  let currentIsland = [] as string[];
  const dfs = (depth: number, char: string) => {
    // nothing is done with the depth thus far
    if (visitedChars.has(char)) return;
    visitedChars.add(char);
    currentIsland.push(char);

    for (let neighbor of inputMap[char]) {
      dfs(depth + 1, neighbor);
    }
  };

  const res = [] as string[][];
  for (let char of chars) {
    if (!visitedChars.has(char)) {
      dfs(0, char);
      res.push(currentIsland);
      currentIsland = [];
    }
  }

  return res;
};

export const expandVariantIslands = (
  allVariants: { [key: string]: Set<string> },
  islands: string[][]
) => {
  const expanded = [] as string[][];
  for (let island of islands) {
    const setified = new Set(island);
    for (let character of island) {
      for (let neighbor of allVariants[character]) {
        setified.add(neighbor);
      }
    }
    expanded.push(Array.from(setified));
  }
  return expanded;
};

export const islandsToObject = (islands: string[][]): VariantsIslandsLookup => {
  const map = { islands, chars: {} } as VariantsIslandsLookup;

  for (let i = 0; i < islands.length; i++) {
    const island = islands[i];
    for (let char of island) {
      if (!(char in map.chars)) {
        map.chars[char] = [];
      }
      map.chars[char].push(i);
    }
  }

  return map;
};

export const variantsToLocalesString = (variants: number[]): string => {
  let res = "";

  const s = new Set<string>();
  for (let variant of variants) {
    switch (variant) {
      case CharacterVariant.gukja:
      case CharacterVariant.korean_standard:
        s.add(CharacterVariantLocale.korean);
        break;

      case CharacterVariant.kokuji:
      case CharacterVariant.japanese_shinjitai:
      case CharacterVariant.japanese_kyujitai:
      case CharacterVariant.joyo_kanji:
      case CharacterVariant.kakikae:
      case CharacterVariant.other_japanese:
        s.add(CharacterVariantLocale.japanese);
        break;

      case CharacterVariant.chinese_simplified:
        s.add(CharacterVariantLocale.chinese_simplified);
        break;

      case CharacterVariant.chinese_traditional:
        s.add(CharacterVariantLocale.chinese_traditional);
        break;

      case CharacterVariant.sawndip_simplified:
      case CharacterVariant.sawndip:
        s.add(CharacterVariantLocale.zhuang);
        break;
    }
  }

  for (let char of s) {
    res += char;
  }

  res = res.split("").sort().join("");

  return res;
};

export const variantsMapToVariantsLocalesMap = (
  map: VariantsMap
): VariantsLocalesMap => {
  const clonedMap = structuredClone(map);
  const vlm = {} as VariantsLocalesMap;

  for (let char in clonedMap) {
    vlm[char] = {
      v: clonedMap[char],
      l: variantsToLocalesString(clonedMap[char]),
    };
  }

  return vlm;
};

const main = async () => {
  /* generate a list of known variants first, e.g. whether a 
  character is a known radical, joyo kanji, simplified character, gukja, etc.*/
  // const IRGSourcesString = (await getRawIRGSources()).split("\n");
  // probably more efficient to assign a list to each character instead of doing an O(number of variants) lookup in the frontend for every single character...

  const getOrthographicVariantsPerCharacterPromise = () =>
    new Promise<{
      [key: string]: Set<string>;
    }>((resolve, reject) => {
      const ivs = new IVS(() => {
        resolve(getOrthographicVariantsPerCharacter(ivs));
      });
    });

  const getAllVariantsPerCharacterPromise = () =>
    new Promise<{
      [key: string]: Set<string>;
    }>((resolve, reject) => {
      const ivs = new IVS(() => {
        resolve(getAllVariantsPerCharacter(ivs));
      });
    });

  const allVariants = await getAllVariantsPerCharacterPromise();
  const orthoVariants = await getOrthographicVariantsPerCharacterPromise();

  const islands = expandVariantIslands(
    allVariants,
    generateVariantIslands(orthoVariants)
  );

  const islandsLookup = islandsToObject(islands);
  writeJSON(
    JSON.stringify(islandsLookup),
    JSON_FILE_NAMES.variantsIslandsLookup
  );

  const addJapaneseShinKyuPromise = (map: VariantsSet) =>
    new Promise<void>((resolve, reject) => {
      const ivs = new IVS(() => {
        addJapaneseShinKyu(ivs, map);
        resolve();
      });
    });

  const map = {} as VariantsSet;
  addRadicals(map);
  await addSawndip(map);
  addKakikae(map);
  addJoyoKanji(map);
  await addKokuji(map);
  addKoreanStandard(map);
  addChinese(map);
  // jp-old-style.txt makes use of IVS characters which I strip
  await addJapaneseShinKyuPromise(map);

  const mapArr = {} as { [key: string]: number[] };
  for (let char in map) {
    mapArr[char] = Array.from(map[char]);
  }

  writeJSON(JSON.stringify(mapArr), JSON_FILE_NAMES.variantsMap);

  writeJSON(
    JSON.stringify(variantsMapToVariantsLocalesMap(mapArr)),
    JSON_FILE_NAMES.variantsLocalesMap
  );
};

export default main;
