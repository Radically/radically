import {
  green,
  indigo,
  cyan,
  purple,
  amber,
  teal,
  blue,
  orange,
} from "@material-ui/core/colors";

export const IDCSet = new Set([
  "⿰",
  "⿱",
  "⿲",
  "⿳",
  "⿴",
  "⿵",
  "⿶",
  "⿷",
  "⿸",
  "⿹",
  "⿺",
  "⿻",
]);

export const StrokePlaceholderSet = new Set([
  "①",
  "②",
  "③",
  "④",
  "⑤",
  "⑥",
  "⑦",
  "⑧",
  "⑨",
  "⑩",
  "⑪",
  "⑫",
  "⑬",
  "⑭",
  "⑮",
  "⑯",
  "⑰",
  "⑱",
  "⑲",
  "⑳",
]);

export const JSON_FILE_NAMES = {
  baseRadicals: "baseRadicals.json",
  forwardMap: "forwardMap.json",
  reverseMap: "reverseMap.json",
  reverseMapIDSOnly: "reverseMapIDSOnly.json",
  reverseMapCharFreqsOnly: "reverseMapCharFreqsOnly.json",

  processedIDSMetadata: "processedIDSMetadata.json",

  strokeCount: "strokeCount.json",
  readings: "readings.json",

  variantsMap: "variantsMap.json",
  variantsLocalesMap: "variantsLocalesMap.json",
  variantsIslandsLookup: "variantsIslandsLookup.json",
};

export const CharacterVariantLocaleColors = {
  chinese_traditional: { dark: cyan[800], light: teal[200] },
  chinese_simplified: { dark: orange[800], light: amber[600] },
  japanese: { dark: purple[300], light: purple[200] },
  korean: { dark: indigo[700], light: indigo["A100"] },
  zhuang: { dark: indigo["A700"], light: blue[400] },
  vietnamese: { dark: green[800], light: green[200] },
} as {
  [key: string]: { dark: string; light: string };
};

// used in MobileAppScreen.tsx when deciding whether to navigate
export const SwipeVelocityThreshold = 0.8;

// only if getInstalledPWAs is available
export const InstallReminderDays = 15;
/* export const PAKO_FILE_NAMES = {
  reverseMap: "reverseMap.pako",
};

export const PROTOBUF_FILE_NAMES = {
  reverseMap: "reverseMap.pako.pbuf",
};

export const REVERSE_MAP_PROTOBUF_DESCRIPTOR = {
  nested: {
    ReverseMap: {
      fields: {
        data: {
          type: "CharData",
          id: 1,
          map: true,
          keyType: "string",
        },
      },
    },
    // data for an individual character
    CharData: {
      fields: {
        utf_code: {
          type: "string",
          id: 1,
        },
        ids_strings: {
          rule: "repeated",
          type: "IdsString",
          id: 2,
        },
        charFreqs: {
          rule: "repeated",
          type: "CharFreq",
          id: 3,
        },
      },
    },
    IdsString: {
      fields: {
        ids: {
          type: "string",
          id: 1,
        },
        locales: {
          type: "string",
          rule: "optional",
          id: 2,
        },
      },
    },
    CharFreq: {
      fields: {
        m: {
          type: "int32",
          map: true,
          keyType: "string",
          id: 1,
        },
      },
    },
  },
}; */
