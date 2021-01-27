import {
  kangxiToCJK /*finalizeReverseMap*/,
  mergeTwoFreqs,
  freqPerm,
  rec,
} from "./genBaseForwardReverse";

test("kangxiToCJK", () => {
  expect(kangxiToCJK("⼀人口⼃⼄乙")).toBe("一人口丿乙乙");
  expect(kangxiToCJK("天地玄黃宇宙洪荒")).toBe("天地玄黃宇宙洪荒");
  expect(kangxiToCJK("abc𠂤def𠀢⼨爨⼹和123")).toBe("abc𠂤def𠀢寸爨彐和123");
});

test("mergeTwoFreqs", () => {
  const freqsA = {
    a: 1,
    b: 2,
    c: 3,
    e: 5,
  };

  const freqsB = {
    a: 2,
    c: 10,
    d: 4,
  };

  expect(mergeTwoFreqs(freqsA, freqsB)).toEqual({
    a: 3,
    b: 2,
    c: 13,
    d: 4,
    e: 5,
  });
});

test("freqPerm", () => {
  // 艹連 in the README
  const powersetsOfIDS = [
    [
      { 十: 1, 丨: 1, 辶: 1, 車: 1 },
      { 十: 2, 辶: 1, 車: 1 },
    ],
    [{ 艹: 1, 連: 1 }],
  ];

  expect(freqPerm(powersetsOfIDS)).toEqual([
    { 艹: 1, 連: 1, 辶: 1, 車: 1, 十: 1, 丨: 1 },
    { 艹: 1, 連: 1, 辶: 1, 車: 1, 十: 2 },
  ]);
});

test("powerset generation", () => {
  const dummyReverseMap = {
    櫣: {
      utf_code: "U+6AE3",
      ids_strings: [
        {
          ids: "⿰木⿺辶莗",
          locales: null,
        },
        {
          ids: "⿰木蓮",
          locales: "[X]",
        },
      ],
    },
    莗: {
      utf_code: "U+8397",
      ids_strings: [
        {
          ids: "⿱艹車",
          locales: null,
        },
      ],
    },
    蓮: {
      utf_code: "U+84EE",
      ids_strings: [
        {
          ids: "⿱艹連",
          locales: null,
        },
        {
          ids: "⿺辶莗",
          locales: "[X]",
        },
      ],
    },
    連: {
      utf_code: "U+9023",
      ids_strings: [
        {
          ids: "⿺辶車",
          locales: null,
        },
      ],
    },
    車: {
      utf_code: "U+8ECA",
      ids_strings: [
        {
          ids: "車",
          locales: null,
        },
      ],
    },
    辶: {
      utf_code: "U+8FB6",
      ids_strings: [
        {
          ids: "辶",
          locales: null,
        },
      ],
    },
    木: {
      utf_code: "U+6728",
      ids_strings: [
        {
          ids: "木",
          locales: null,
        },
      ],
    },
    艹: {
      utf_code: "U+8279",
      ids_strings: [
        {
          ids: "⿻十丨",
          locales: "[GJ]",
        },
        {
          ids: "⿰十十",
          locales: "[TK]",
        },
      ],
    },
    十: {
      utf_code: "U+5341",
      ids_strings: [
        {
          ids: "十",
          locales: null,
        },
      ],
    },
    丨: {
      utf_code: "U+4E28",
      ids_strings: [
        {
          ids: "丨",
          locales: null,
        },
      ],
    },
  } as ReverseMap;

  expect(rec(dummyReverseMap, "櫣")).toEqual([
    { 丨: 1, 十: 1, 木: 1, 艹: 1, 莗: 1, 車: 1, 辶: 1 },
    { 十: 2, 木: 1, 艹: 1, 莗: 1, 車: 1, 辶: 1 },
    { 丨: 1, 十: 1, 木: 1, 艹: 1, 蓮: 1, 車: 1, 辶: 1, 連: 1 },
    { 十: 2, 木: 1, 艹: 1, 蓮: 1, 車: 1, 辶: 1, 連: 1 },
    { 丨: 1, 十: 1, 木: 1, 艹: 1, 莗: 1, 蓮: 1, 車: 1, 辶: 1 },
    { 十: 2, 木: 1, 艹: 1, 莗: 1, 蓮: 1, 車: 1, 辶: 1 },
  ]);
});
