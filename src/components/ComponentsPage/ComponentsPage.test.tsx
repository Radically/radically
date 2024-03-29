import React from "react";
import { getByText, render, screen } from "@testing-library/react";

import ComponentsPage from "./index";
import { IntlProvider } from "react-intl";

import i18n_data from "../../i18n_data.json";
import { DataContext } from "../../contexts/DataContextProvider";
import { SnackbarProviderWrapper } from "../../AppScreen";
const i18n = i18n_data as { [key: string]: any };

jest.mock(
  "react-virtualized-auto-sizer",
  () =>
    ({ children }: any) =>
      children({ height: 800, width: 600 }) // each row is 45px high...
);

const mockDataContext = {
  baseRadicals: ["a", "b", "c", "d", "e", "f", "x", "y", "z"] as BaseRadicals,
  baseRadicalsLoading: false,

  // metadata,
  metadataLoading: false,

  strokeCount: { a: 2, b: 5, c: 9, d: 1, e: 4, f: 6, x: 10, y: 11, z: 12 }, // thus we have 45 * 9 * 2 = 810 px
  strokeCountLoading: false,
  readings: {
    a: { dummy: "test a reading" },
    b: { dummy: "test b reading" },
    c: { dummy: "test c reading" },
    x: { dummy: "test x reading" },
    y: { dummy: "test y reading" },
    z: { dummy: "test z reading" },
  },

  readingsLoading: false,

  variantsLocales: {
    a: { v: [14, 6, 2, 10, 9], l: "JKST" },
    b: { v: [14, 9], l: "S" },
  },

  variantsLocalesLoading: false,

  variantsIslands: {
    islands: [] as string[][],
    chars: {},
  },
  variantsIslandsLoading: false,

  reverseMapIDSOnly: {},
  reverseMapIDSOnlyLoading: false,

  reverseMapCharFreqsOnly: {},
  reverseMapCharFreqsOnlyLoading: false,

  forwardMap: {},
  forwardMapLoading: false,
  // setExactRadicalFreq,
  // setMetadata,
  // setReadings,
  // loading,
};

const charactersPerRowMockDataContext = {
  ...mockDataContext,
  baseRadicals: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  baseRadicalsLoading: false,

  // metadata,
  metadataLoading: false,

  strokeCount: {
    a: 2,
    b: 5,
    c: 9,
    d: 1,
    e: 4,

    f: 6,
    g: 6,
    h: 6,
    i: 6,
    j: 6,
    k: 6,
    l: 6,
    m: 6,
    n: 6,
    o: 6,
    p: 6,
    q: 6,
    r: 6,
    s: 6,
    t: 6,
    u: 6,
    v: 6,
    w: 6,

    x: 10,
    y: 11,
    z: 12,
  },
  strokeCountLoading: false,
  readings: {
    a: { dummy: "test a reading" },
    b: { dummy: "test b reading" },
    c: { dummy: "test c reading" },
    x: { dummy: "test x reading" },
    y: { dummy: "test y reading" },
    z: { dummy: "test z reading" },
  },

  readingsLoading: false,

  variantsLocales: {
    a: { v: [14, 6, 2, 10, 9], l: "JKST" },
    b: { v: [14, 9], l: "S" },
  },

  variantsLocalesLoading: false,
};

describe("Components Page Tests", () => {
  test("test stroke count appear in the right scrolling pane", () => {
    render(
      <SnackbarProviderWrapper>
        <DataContext.Provider value={mockDataContext}>
          <IntlProvider locale="en" messages={i18n["en"]}>
            <ComponentsPage />
          </IntlProvider>
        </DataContext.Provider>
      </SnackbarProviderWrapper>
    );

    const container = document.querySelector(
      "#components-page-strokes-components-container"
    ) as HTMLElement;

    for (let cnt of Object.values(mockDataContext.strokeCount)) {
      expect(
        getByText(container, `${cnt} stroke${cnt === 1 ? "" : "s"}`)
      ).toBeInTheDocument();
    }
  });

  test("test stroke count appear in the left scrolling pane", () => {
    render(
      <SnackbarProviderWrapper>
        <DataContext.Provider value={mockDataContext}>
          <IntlProvider locale="en" messages={i18n["en"]}>
            <ComponentsPage />
          </IntlProvider>
        </DataContext.Provider>
      </SnackbarProviderWrapper>
    );

    const container = document.querySelector(
      "#components-page-strokes-components-container"
    ) as HTMLElement;

    for (let cnt of Object.values(mockDataContext.strokeCount)) {
      expect(getByText(container, cnt));
    }
  });

  test("characters per row", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 600,
    });

    window.dispatchEvent(new Event("resize"));

    render(
      <SnackbarProviderWrapper>
        <DataContext.Provider value={charactersPerRowMockDataContext}>
          <IntlProvider locale="en" messages={i18n["en"]}>
            <ComponentsPage />
          </IntlProvider>
        </DataContext.Provider>
      </SnackbarProviderWrapper>
    );

    // first, find the row beginning with "6 strokes"
    const sixStrokesHeader = screen.getByText("6 strokes");
    const firstRowBelowSixStrokesHeader = sixStrokesHeader.nextElementSibling;

    expect(firstRowBelowSixStrokesHeader).not.toBeNull();
    expect(firstRowBelowSixStrokesHeader?.children.length).toEqual(
      Math.floor(600 / 50) // refer to getRadicalsPerRow in utils.ts
    );
  });
});
