import red from "@material-ui/core/colors/red";
import { withTheme } from "@material-ui/core/styles";

import styled from "styled-components";
import { CharacterVariantLocaleColors } from "../../constants";
import { CharacterVariantLocale } from "../../types/common";

const variantLocalesToLinearGradient = (locales: string, darkMode?: boolean): string => {
  if (locales.length === 0) return "none;";
  const colorStrings: string[] = [];
  // const stripePercentage = Math.round((100 / locales.length) * 100) / 100;
  const stripePercentage = 100 / locales.length;

  const percentageArray = [] as [number, number][];

  let cumulPercentage = 0;
  for (let locale of locales) {
    switch (locale) {
      case CharacterVariantLocale.chinese_traditional:
        colorStrings.push(darkMode ? CharacterVariantLocaleColors.chinese_traditional.dark : CharacterVariantLocaleColors.chinese_traditional.light);
        break;

      case CharacterVariantLocale.chinese_simplified:
        colorStrings.push(darkMode ? CharacterVariantLocaleColors.chinese_simplified.dark : CharacterVariantLocaleColors.chinese_simplified.light);
        break;

      case CharacterVariantLocale.japanese:
        colorStrings.push(darkMode ? CharacterVariantLocaleColors.japanese.dark : CharacterVariantLocaleColors.japanese.light);
        break;
      case CharacterVariantLocale.korean:
        colorStrings.push(darkMode ? CharacterVariantLocaleColors.korean.dark : CharacterVariantLocaleColors.korean.light);
        break;
      case CharacterVariantLocale.zhuang:
        colorStrings.push(darkMode ? CharacterVariantLocaleColors.zhuang.dark : CharacterVariantLocaleColors.zhuang.light);
        break;
      case CharacterVariantLocale.vietnamese:
        colorStrings.push(darkMode ? CharacterVariantLocaleColors.vietnamese.dark : CharacterVariantLocaleColors.vietnamese.light);
        break;
    }
    percentageArray.push([cumulPercentage, cumulPercentage + stripePercentage]);
    cumulPercentage += stripePercentage;
  }

  percentageArray[percentageArray.length - 1][1] = 100;

  const linearGradientString = colorStrings.map(
    (color, idx) =>
      `${color} ${percentageArray[idx][0]}% ${percentageArray[idx][1]}%`
  );

  return `linear-gradient(0deg, ${linearGradientString.join(", ")});`;
};

const IndividualComponentCell = withTheme(styled("div") <{
  selected: boolean;
  filler?: boolean;
  darkMode?: boolean;
  characterVariantLocales?: string;
}>`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) =>
    props.filler || props.selected
      ? "none"
      : variantLocalesToLinearGradient(props.characterVariantLocales || "", props.darkMode)};
  background-color: ${(props) => (props.selected ? red[700] : "none")};
  color: ${(props) =>
    props.selected ? "white" : props.theme.palette.text.primary};
  border-radius: 5px;
  cursor: pointer;
`);

export default IndividualComponentCell;
