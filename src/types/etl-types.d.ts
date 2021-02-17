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

// type ReverseMapCharOnly = { [key: string]: { [key: string]: number }[] };

// map of character to component in THE UNION OF ALL POWERSETS 
// to the LARGEST NUMBER OF OCCURRENCES ACROSS ALL POWERSETS
// WITHOUT ALL COMPONENTS WITH OCCURRENCE 1
// weird frontend-specific data structure
type ReverseMapCharOnly = { [key: string]: { [key: string]: number } };

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

interface VariantsMap {
  [key: string]: number[];
}

interface VariantsLocalesMap {
  [key: string]: {
    v: number[];
    l: string; // string should only be composed of CharacterVariantLocale
  };
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
