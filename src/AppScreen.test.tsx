global.CSS = { supports: jest.fn(), escape: jest.fn() };

jest.mock("./searchworker");

import React from "react";
import { render, screen } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import AppScreen from "./AppScreen";

import * as utils from "./utils";

function createMatchMedia(width: number) {
  return (query: string) => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {},
  });
}

describe("Smoke Tests", () => {
  beforeAll(() => {
    // @ts-ignore
    window.matchMedia = createMatchMedia(window.innerWidth);
  });

  test("renders app description", () => {
    render(<AppScreen />);
    const subtitle = screen.getByTestId("radically-subtitle");
    expect(subtitle).toBeInTheDocument();
  });

  test("bottom navigation is visible below mobile breakpoint (max-width: 767px), see utils.ts", () => {
    jest.spyOn(utils, "useIsMobile").mockImplementation(() => true);
    render(<AppScreen />);
    const bottomNavigation = screen.getByTestId("bottom-navigation");
    expect(bottomNavigation).toBeInTheDocument();
  });

  test("all elements of the main interface are rendered in desktop mode", () => {
    jest.spyOn(utils, "useIsMobile").mockImplementation(() => false);
    render(<AppScreen />);

    const firstPage = screen.getByTestId("first-page-container-desktop");
    expect(firstPage).toBeInTheDocument();

    const componentsPageContainer = screen.getByTestId(
      "components-page-container"
    );
    expect(componentsPageContainer).toBeInTheDocument();

    const resultsPageContainer = screen.getByTestId("results-page-container");
    expect(resultsPageContainer).toBeInTheDocument();
  });
});
