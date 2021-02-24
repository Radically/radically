import { IntlShape } from "react-intl";
import { CharacterVariant } from "../../types/common";
import { isCJK } from "../../utils";

export const DEFAULT_RADICALS_PER_ROW = 10;
export const UNKNOWN_STROKE_COUNT = 999;

export const strokeCountToRadicals = (
  baseRadicals: BaseRadicals,
  strokeCount: StrokeCount
): { [key: number]: string[] } => {
  const res = { 999: [] } as { [key: number]: string[] };

  for (let radical of baseRadicals) {
    const strokes = strokeCount[radical] || 999;
    if (!res[strokes]) res[strokes] = [];
    res[strokes].push(radical);
  }
  if (res[999].length == 0) delete res[999];
  return res;
};

export const arrayifyForReactWindow = (
  strokeCountToRadicals: {
    [key: number]: string[];
  },
  intl: IntlShape,
  radicalsPerRow = DEFAULT_RADICALS_PER_ROW
): {
  arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[];
  // the index of the header for that particular stroke count group
  strokeCountToStart: { [key: string]: number };
} => {
  const arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[] = [];
  const strokeCountToStart: { [key: string]: number } = {};
  for (let strokeCount in strokeCountToRadicals) {
    strokeCountToStart[strokeCount] = arrayified.length;
    arrayified.push({
      header: true,
      name: `${
        strokeCount === "999"
          ? ""
          : intl.formatMessage(
              {
                id: "strokes",
              },
              { count: strokeCount }
            )
      }${
        strokeCount === "999"
          ? intl.formatMessage({
              id: "unclear",
            })
          : ""
      }`,
    });

    let tempArray;
    for (
      let i = 0, j = strokeCountToRadicals[strokeCount].length;
      i < j;
      i += radicalsPerRow
    ) {
      tempArray = strokeCountToRadicals[strokeCount].slice(
        i,
        i + radicalsPerRow
      );
      arrayified.push({
        header: false,
        radicals: tempArray,
      });
    }
  }
  return { arrayified, strokeCountToStart };
};

export const arrayifySearchResultsForReactWindow = (
  searchResults: { [key: string]: string[] },
  radicalsPerRow = DEFAULT_RADICALS_PER_ROW
): {
  arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[];
  // the index of the header for that particular stroke count group
  radicalToStart: { [key: string]: number };
} => {
  // technically order doesn't matter
  const arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[] = [];

  const radicalToStart: { [key: string]: number } = {};
  for (let result in searchResults) {
    radicalToStart[result] = arrayified.length;

    arrayified.push({
      header: true,
      name: result,
    });

    let tempArray;
    for (
      let i = 0, j = searchResults[result].length;
      i < j;
      i += radicalsPerRow
    ) {
      tempArray = searchResults[result].slice(i, i + radicalsPerRow);
      arrayified.push({
        header: false,
        radicals: tempArray,
      });
    }
  }
  return { arrayified, radicalToStart };
};

export const getStringForCharacterVariants = (
  variants: number[],
  intl: IntlShape
): string | undefined => {
  if (!variants || variants.length === 0) return undefined;
  return variants
    .map((variant) => {
      switch (variant) {
        case CharacterVariant.gukja:
          return intl.formatMessage({
            id: "variant.gukja",
          });
        case CharacterVariant.korean_standard:
          return intl.formatMessage({
            id: "variant.korean_standard",
          });
        case CharacterVariant.kokuji:
          return intl.formatMessage({
            id: "variant.kokuji",
          });
        case CharacterVariant.japanese_shinjitai:
          return intl.formatMessage({
            id: "variant.japanese_shinjitai",
          });
        case CharacterVariant.japanese_kyujitai:
          return intl.formatMessage({
            id: "variant.japanese_kyujitai",
          });

        case CharacterVariant.joyo_kanji:
          return intl.formatMessage({
            id: "variant.joyo_kanji",
          });

        case CharacterVariant.kakikae:
          return intl.formatMessage({
            id: "variant.kakikae",
          });

        case CharacterVariant.other_japanese:
          return intl.formatMessage({
            id: "variant.other_japanese",
          });

        case CharacterVariant.chinese_simplified:
          return intl.formatMessage({
            id: "variant.chinese_simplified",
          });

        case CharacterVariant.chinese_traditional:
          return intl.formatMessage({
            id: "variant.chinese_traditional",
          });

        case CharacterVariant.other_simplified:
          return intl.formatMessage({
            id: "variant.other_simplified",
          });

        case CharacterVariant.sawndip_simplified:
          return intl.formatMessage({
            id: "variant.sawndip_simplified",
          });

        case CharacterVariant.sawndip:
          return intl.formatMessage({
            id: "variant.sawndip",
          });

        case CharacterVariant.radical:
          return intl.formatMessage({
            id: "variant.radical",
          });

        case CharacterVariant.unicode_pua:
          return intl.formatMessage({
            id: "variant.unicode_pua",
          });
      }
    })
    .join(" • ");
};

export const getDecompositionAndVariants = (
  char: string,
  reverseMapIDSOnly: ReverseMapIDSOnly,
  variantsIslands: VariantsIslandsLookup
): string[] => {
  const set = new Set<string>();
  if (char in reverseMapIDSOnly) {
    for (let { i, l } of reverseMapIDSOnly[char]) {
      for (let char of i) {
        if (isCJK(char)) {
          set.add(char);
        }
      }
    }
  }

  if (char in variantsIslands.chars) {
    const islands = variantsIslands.chars[char];
    for (let island of islands) {
      for (let variant of variantsIslands.islands[island]) {
        set.add(variant);
      }
    }
  }

  set.add(char); // add the char itself

  return Array.from(set);
};
