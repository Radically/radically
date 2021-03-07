import { filterUsingIDCs, performComponentQuery } from ".";

const forwardMap1 = {
  人: ["从"],
  从: ["𡚅", "𠚕", "众"],
  "𠚕": ["齒"],
  齒: ["𪙹", "𪙧"],
};

const reverseMapCharFreqsOnly = {
  从: { 人: 2 },
  "𡚅": { 从: 3, 人: 7, 仌: 2 },
  齒: { 从: 2, 人: 4 },
  "𪙹": { 齒: 2, 止: 2, "𠚕": 2, 凵: 2, 从: 4, 一: 2, 人: 8 },
  "𪙧": { 人: 5, 幺: 2, 一: 2, 从: 2 },
  众: { 人: 3 },
  // 仐 is not in the map because it contains only 1 instance of 人 and one instance of 十
};

const components1 = "人人人人";
// 𡚅 has 7 instances of 人, 齒 has 4 instances, 众 has three
test("query with atLeastComponentFreq == true", () => {
  let results = performComponentQuery(
    forwardMap1,
    reverseMapCharFreqsOnly,
    components1,
    true
  );
  const expectedResults1 = new Set(["𡚅", "齒", "𪙹", "𪙧"]); // 从 and 众 aren't in there
  expect(results).toEqual(expectedResults1);
});

test("query with atLeastComponentFreq == false", () => {
  let results = performComponentQuery(
    forwardMap1,
    reverseMapCharFreqsOnly,
    components1,
    false
  );
  const expectedResults1 = new Set(["从", "𡚅", "𠚕", "众", "齒", "𪙹", "𪙧"]);
  expect(results).toEqual(expectedResults1);
});

const reverseMapCharIDSOnly = {
  與: [{ i: "⿶舁与", l: null }],
  义: [{ i: "⿶乂丶", l: null }],
  凶: [{ i: "⿶凵㐅", l: null }],
  出: [{ i: "⿱屮凵", l: null }],
  函: [
    { i: "⿶凵⿻了⿱丷八", l: "[GTV]" },
    { i: "⿶凵⿻丂⿱丷八", l: "[JK]" },
  ],
  半: [
    { i: "⿱丷⿻二丨", l: "[GTJV]" },
    { i: "⿱八⿻二丨", l: "[K]" },
  ],
};

test("filterUsingIDCs", () => {
  const results = ["與", "义", "凶", "出", "函", "半"];
  expect(filterUsingIDCs(reverseMapCharIDSOnly, results, "⿶")).toEqual([
    "與",
    "义",
    "凶",
    "函",
  ]);

  expect(filterUsingIDCs(reverseMapCharIDSOnly, results, "⿱")).toEqual([
    "出",
    "函",
    "半",
  ]);

  expect(filterUsingIDCs(reverseMapCharIDSOnly, results, "⿶⿻")).toEqual([
    "函",
  ]);
});
