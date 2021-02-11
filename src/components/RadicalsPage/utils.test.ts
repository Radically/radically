import { IntlShape } from "react-intl";
import { strokeCountToRadicals, arrayifyForReactWindow } from "./utils";
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

export const mockIntl = ({
  defaultLocale: "en",
  formatDate: () => "mock date",
  formatHTMLMessage: ({ id }: { id: string }) => id,
  formatMessage: ({ id }: { id: string }) => id,
  formatNumber: (value: any) => `${value}`,
  formatPlural: (value: any) => `${value}`,
  formatTime: (value: any) => `${value}`,
  formatRelative: (value: any) => `${value}`,
  now: () => 0,
} as unknown) as IntlShape;

test("arrayifyForReactWindow", () => {
  const strokeCountToRadicals = {
    1: ["a", "b", "c"],
    3: ["d", "e", "f", "g"],
    6: ["h", "i"],
  };

  expect(arrayifyForReactWindow(strokeCountToRadicals, mockIntl)).toEqual({
    arrayified: [
      { header: true, name: "strokes" },
      { header: false, radicals: ["a", "b", "c"] },
      { header: true, name: "strokes" },
      { header: false, radicals: ["d", "e", "f", "g"] },
      { header: true, name: "strokes" },
      { header: false, radicals: ["h", "i"] },
    ],
    strokeCountToStart: { "1": 0, "3": 2, "6": 4 },
  });
});
