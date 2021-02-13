import React from "react";
import { getByText, render, screen } from "@testing-library/react";

import RadicalsPage from "./index";
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

describe("Radicals Page Tests", () => {
  test("test stroke count appear", () => {
    render(
      <DataContext.Provider value={mockDataContext}>
        <IntlProvider locale="en" messages={i18n["en"]}>
          <RadicalsPage />
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
          <RadicalsPage />
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
});
