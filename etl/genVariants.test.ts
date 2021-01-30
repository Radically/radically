import {
  addJapaneseShinKyu,
  generateVariantIslands,
  islandsToObject,
  expandVariantIslands,
} from "./genVariants";
const IVS = require("ivs");

test("all ivs sequences stripped", (done) => {
  const ivs = new IVS(() => {
    const map = {} as { [key: string]: Set<number> };
    addJapaneseShinKyu(ivs, map);

    /* it appears innocuous, but the 違 in jp-old-style.txt
    is \u9055\udb40\udd02 (with an ivs sequence)
    the true assertions are the same character but
    without the \udb40\udd02 or similar 
    ivs selection sequences */
    expect("違󠄂" in map).toEqual(false);
    expect("違" in map).toEqual(true);

    expect("爲󠄀" in map).toEqual(false);
    expect("爲" in map).toEqual(true);
    done();
  });
});

test("generate variants islands", () => {
  const adjMap = {
    // 1st island
    A: new Set(["B", "D"]),
    D: new Set(["A"]),
    B: new Set(["A", "C"]),
    C: new Set(["B", "E"]),
    E: new Set(["C"]),
    // 2nd island
    F: new Set(["G"]),
    G: new Set(["F", "H", "I"]),
    H: new Set(["G"]),
    I: new Set(["G", "J"]),
    J: new Set(["I"]),
  };

  const islands = generateVariantIslands(adjMap);
  expect(islands).toEqual([
    ["A", "B", "C", "E", "D"],
    ["F", "G", "H", "I", "J"],
  ]);
});

test("generate variants islands lookup", () => {
  const islands = [
    ["A", "B", "C", "E", "D"],
    ["F", "G", "H", "I", "J"],
  ];

  expect(islandsToObject(islands)).toEqual({
    islands,
    chars: {
      A: [0],
      B: [0],
      C: [0],
      D: [0],
      E: [0],
      F: [1],
      G: [1],
      H: [1],
      I: [1],
      J: [1],
    },
  });
});

test("expand variants islands", () => {
  const adjMap = {
    // 1st island
    A: new Set(["B", "D"]),
    D: new Set(["A", "Y"]),
    B: new Set(["A", "C"]),
    C: new Set(["B", "E"]),
    E: new Set(["C"]),
    // 2nd island
    F: new Set(["G"]),
    G: new Set(["F", "H", "I"]),
    H: new Set(["G"]),
    I: new Set(["G", "J"]),
    J: new Set(["I", "Z"]),
  };

  const islands = [
    ["A", "B", "C", "E", "D"],
    ["F", "G", "H", "I", "J"],
  ];

  expect(expandVariantIslands(adjMap, islands)).toEqual([
    ["A", "B", "C", "E", "D", "Y"],
    ["F", "G", "H", "I", "J", "Z"],
  ]);
});
