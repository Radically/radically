import { performComponentQuery } from ".";

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
