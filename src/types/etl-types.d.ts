// types for the JSON files generated by the etl process

type powerset = {
  [key: string]: number;
};

interface ReverseMap {
  [key: string]: {
    utf_code: string;
    ids_strings: {
      ids: string;
      locales: string;
    }[];
    charFreqs?: powerset[];
  };
}

/* interface PBufReverseMap {
  data: {
    [key: string]: {
      utf_code: string;
      ids_strings: {
        ids: string;
        locales: string;
      }[];
      charFreqs?: { m: {
        [key: string]: number;
      }}[];
    };
  }
} */

type ReverseMapCharOnly = { [key: string]: { [key: string]: number }[] };

type ReverseMapIDSOnly = { [key: string]: { i: string; l: string | null }[] };

interface ForwardMap {
  [key: string]: string[];
}

type BaseRadicals = string[];
interface StrokeCount {
  [key: string]: number;
}

type StrokeCountMap = StrokeCount;

interface ReadingsMap {
  [key: string]: { [key: string]: string };
}

// not mutually exclusive
// https://stackoverflow.com/questions/62235860/imported-typescript-enum-doesnt-work-in-compiled-output
const enum CharacterVariant {
  gukja = 1, // TODO
  korean_standard = 2,
  kokuji = 3,
  japanese_shinjitai = 4,
  japanese_kyujitai = 5,
  joyo_kanji = 6,
  kakikae = 7,
  other_japanese = 8,
  chinese_simplified = 9,
  chinese_traditional = 10,
  other_simplified = 11, // such as pseudo-simplified
  sawndip_simplified = 12, // TODO
  sawndip = 13,
  radical = 14,
}

interface VariantsMap {
  [key: string]: number[];
}

interface VariantsIslandsLookup {
  islands: string[][];
  chars: { [key: string]: number[] };
}

interface VariantRadicals {
  [key: string]: Set<string>;
}

interface Readings {
  [key: string]: {
    [key: string]: string;
  };
}

interface QueryResults {
  charToSet: {
    [key: string]: Set<string>;
  } | null;
  res: Set<string> | null;
}

interface ProcessedIDSMetadata {
  entries: string;
  unique_radicals: number;
  date: string;
}
