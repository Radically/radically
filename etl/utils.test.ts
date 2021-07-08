import { isValidIDS } from "./utils";

test("isValidIDS", () => {
  expect(isValidIDS("⿱刀⑤")).toBe(false);
});
