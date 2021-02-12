// not mutually exclusive
// https://stackoverflow.com/questions/62235860/imported-typescript-enum-doesnt-work-in-compiled-output
export enum CharacterVariant {
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

// nothing to do with any existing standards, self-defined
export enum CharacterVariantLocale {
  chinese_traditional = "T",
  chinese_simplified = "S",
  japanese = "J",
  korean = "K",
  zhuang = "Z",
  vietnamese = "V", // unused
}