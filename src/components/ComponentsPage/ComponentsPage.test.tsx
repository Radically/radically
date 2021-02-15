import React from "react";
import { getByText, render, screen } from "@testing-library/react";

import ComponentsPage from "./index";
import { IntlProvider } from "react-intl";

import i18n_data from "../../i18n_data.json";
import { DataContext } from "../../contexts/DataContextProvider";
const i18n = i18n_data as { [key: string]: any };

jest.mock("react-virtualized-auto-sizer", () => ({ children }: any) =>
  children({ height: 600, width: 600 })
);

const mockDataContext = {
  baseRadicals: ["a", "b", "c", "d", "e", "f", "x", "y", "z"],
  baseRadicalsLoading: false,

  // metadata,
  metadataLoading: false,

  strokeCount: { a: 2, b: 5, c: 9, d: 1, e: 4, f: 6, x: 10, y: 11, z: 12 },
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
  // setExactRadicalFreq,
  // setMetadata,
  // setReadings,
  // loading,
};

describe("Components Page Tests", () => {
  test("test stroke count appear", () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <IntlProvider locale="en" messages={i18n["en"]}>
          <ComponentsPage />
        </IntlProvider>
      </DataContext.Provider>
    );

    for (let cnt of Object.values(mockDataContext.strokeCount)) {
      expect(
        screen.getByText(`${cnt} stroke${cnt === 1 ? "" : "s"}`)
      ).toBeInTheDocument();
    }
  });

  test("test stroke count appear in the left scrolling pane", () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <IntlProvider locale="en" messages={i18n["en"]}>
          <ComponentsPage />
        </IntlProvider>
      </DataContext.Provider>
    );

    const container = document.querySelector(
      "#strokes-scroll-container"
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
      <DataContext.Provider
        value={{
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
        }}
      >
        <IntlProvider locale="en" messages={i18n["en"]}>
          <ComponentsPage />
        </IntlProvider>
      </DataContext.Provider>
    );

    // first, find the row beginning with "6 strokes"
    const sixStrokesHeader = screen.getByText("6 strokes");
    const firstRowBelowSixStrokesHeader = sixStrokesHeader.nextElementSibling;

    expect(firstRowBelowSixStrokesHeader).not.toBeNull();
    expect(firstRowBelowSixStrokesHeader?.children.length).toEqual(
      Math.floor(600 / 40)
    );
  });
});
