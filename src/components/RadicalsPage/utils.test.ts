import { strokeCountToRadicals } from "./utils";
test("stroke count to list of radicals map", () => {
  const baseRadicals = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  const strokeCount = { a: 1, b: 1, c: 1, d: 2, e: 2, f: 2, g: 3, h: 3, i: 3 };

  expect(strokeCountToRadicals(baseRadicals, strokeCount)).toEqual({
    1: ["a", "b", "c"],
    2: ["d", "e", "f"],
    3: ["g", "h", "i"],
    999: [],
  });
});
