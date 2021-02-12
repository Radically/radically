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
