import { IntlShape } from "react-intl";

export const RADICALS_PER_ROW = 10;
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
  return res;
};

export const arrayifyForReactWindow = (
  strokeCountToRadicals: {
    [key: number]: string[];
  },
  intl: IntlShape
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
      i += RADICALS_PER_ROW
    ) {
      tempArray = strokeCountToRadicals[strokeCount].slice(
        i,
        i + RADICALS_PER_ROW
      );
      arrayified.push({
        header: false,
        radicals: tempArray,
      });
    }
  }
  return { arrayified, strokeCountToStart };
};
