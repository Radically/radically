global.CSS = { supports: jest.fn(), escape: jest.fn() };

jest.mock("./searchworker");

import React from "react";
import { render, screen } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import AppScreen from "./AppScreen";

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

  test("renders learn react link", () => {
    render(<AppScreen />);
    const linkElement = screen.getByText(/IDC/i);
    expect(linkElement).toBeInTheDocument();
  });
});
