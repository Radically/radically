import red from "@material-ui/core/colors/red";
import "jest-styled-components";
import renderer from "react-test-renderer";
import IndividualRadicalCell from ".";
import { CharacterVariantLocaleColors } from "../../constants";

describe("Radicals Page Tests", () => {
  test("linear-gradient dark background of individual radical cell", () => {
    const tree = renderer
      .create(
        <IndividualRadicalCell
          id="radical-test-test"
          filler={false}
          selected={false}
          darkMode={true}
          characterVariantLocales={"JSTV"}
        >
          A
        </IndividualRadicalCell>
      )
      .toJSON();

    expect(tree).toHaveStyleRule(
      "background",
      `linear-gradient(0deg,${CharacterVariantLocaleColors.japanese.dark} 0% 25%,${CharacterVariantLocaleColors.chinese_simplified.dark} 25% 50%,${CharacterVariantLocaleColors.chinese_traditional.dark} 50% 75%,${CharacterVariantLocaleColors.vietnamese.dark} 75% 100%)`
    );
  });

  test("linear-gradient light background of individual radical cell", () => {
    const tree = renderer
      .create(
        <IndividualRadicalCell
          id="radical-test-test"
          filler={false}
          selected={false}
          darkMode={false}
          characterVariantLocales={"JSKV"}
        >
          A
        </IndividualRadicalCell>
      )
      .toJSON();

    expect(tree).toHaveStyleRule(
      "background",
      `linear-gradient(0deg,${CharacterVariantLocaleColors.japanese.light} 0% 25%,${CharacterVariantLocaleColors.chinese_simplified.light} 25% 50%,${CharacterVariantLocaleColors.korean.light} 50% 75%,${CharacterVariantLocaleColors.vietnamese.light} 75% 100%)`
    );
  });

  test("selected background", () => {
    const tree = renderer
      .create(
        <IndividualRadicalCell
          id="radical-test-test"
          filler={false}
          selected={true}
          darkMode={false}
          characterVariantLocales={"JSKV"}
        >
          A
        </IndividualRadicalCell>
      )
      .toJSON();

    expect(tree).toHaveStyleRule("background-color", `${red[700]}`);
  });
});
