import React, { useContext } from "react";
import { CharacterVariantLocaleColors } from "../../constants";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { SectionTitle, SectionParagraph, LargeSpan } from "./shared";
import U6EEBExample from "./u6eeb-example";
import { FormattedMessage, useIntl } from "react-intl";
import IconDescRow from "./GetInTouchRow";
import styled from "styled-components";
import { HeaderRow, NormalRow } from "../ComponentsScrollComponents";
import IndividualComponentCell from "../IndividualComponentCell";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import { makeStyles, withTheme } from "@material-ui/core/styles";

import { github } from "./links.json";

import {
  getRadicalsPerRow,
  notPositive,
  useWindowDimensions,
} from "../../utils";
import { widthPx } from "../FirstPage/desktop";
import { Link } from "react-router-dom";

const ColorDemoSquare = styled.div`
  height: 35px;
  width: 35px;
  border-radius: 5px;
`;

const LocaleColorToName = {
  chinese_simplified: (
    <FormattedMessage
      id="locale.chinese_simplified"
      defaultMessage="Simplified Chinese"
    />
  ),
  japanese: (
    <FormattedMessage
      id="locale.japanese"
      defaultMessage="Japanese, incl. Wasei Kanji, Shinjitai, & Kyujitai"
    />
  ),
  korean: (
    <FormattedMessage
      id="locale.korean"
      defaultMessage="Korean, incl. Gukja, Basic Hanja, and preferred Hanja forms (e.g. 曺 aka 曹)"
    />
  ),
  zhuang: <FormattedMessage id="locale.zhuang" defaultMessage="Zhuang" />,
  chinese_traditional: (
    <FormattedMessage
      id="locale.chinese_traditional"
      defaultMessage="Traditional Chinese"
    />
  ),
} as { [key: string]: JSX.Element };

const useButtonStyles = makeStyles((theme) => ({
  root: {
    display: "inline",
    fontSize: "9pt",
    borderRadius: 0,
    // fontFamily: "var(--default-sans);",
    // fontWeight: "bold",
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    lineHeight: "1em",
    "&:hover": {
      border: `2px solid ${theme.palette.primary.main}`,
    },
    "&:active": {
      border: `2px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    // width: "100%",
  },
}));

export const UsageSection = (props: { desktop?: false }) => {
  const { desktop } = props;
  const { darkMode } = useContext(SettingsContext);

  const { width, height } = useWindowDimensions();

  const radicalsPerRow = notPositive(
    getRadicalsPerRow(
      !!desktop && !!width && width > widthPx
        ? (width - widthPx) / 2
        : width || 320
    ),
    10
  );

  const buttonStyles = useButtonStyles();
  return (
    <>
      <div>
        <SectionTitle darkMode={darkMode}>Usage</SectionTitle>
      </div>

      <SectionParagraph darkMode={darkMode}>
        It is assumed that you are familiar with any CJK input method and are
        able to input most of the basic characters, e.g. the default,
        indecomposible, colored characters in the Components section, such as
        日月火水木金土.
      </SectionParagraph>

      {/* nested div necessary for Safari iOS */}
      <div>
        <div
          style={{
            paddingTop: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <U6EEBExample />

          <SectionParagraph style={{ margin: 0 }} darkMode={darkMode}>
            Let us search for U+6EEB 滫, which can be decomposed into the water
            radical (氵), person radical (亻), 夂 or 攵, and 月:
          </SectionParagraph>
        </div>
      </div>

      <SectionParagraph darkMode={darkMode}>
        ❶ Search for 水人 in the Components section. You should see
        (abbreviated):
        <HeaderRow style={{ height: "45px" }}>水</HeaderRow>
        <NormalRow style={{ height: "45px" }}>
          <IndividualComponentCell darkMode={darkMode}>
            ㇇
          </IndividualComponentCell>
          <IndividualComponentCell darkMode={darkMode}>
            亅
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="T"
            darkMode={darkMode}
          >
            沝
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="JKST"
            darkMode={darkMode}
          >
            水
          </IndividualComponentCell>
          <IndividualComponentCell
            selected
            characterVariantLocales="S"
            darkMode={darkMode}
          >
            氵
          </IndividualComponentCell>

          {new Array(radicalsPerRow - 5)
            .fill(undefined)
            .map((x, col: number) => (
              <IndividualComponentCell
                filler={true}
                // key={`filler-${index}-${col}`}
                selected={false}
              />
            ))}
        </NormalRow>
        <HeaderRow style={{ height: "45px" }}>人</HeaderRow>
        <NormalRow style={{ height: "45px" }}>
          <IndividualComponentCell
            characterVariantLocales="JKST"
            darkMode={darkMode}
          >
            人
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="JKST"
            darkMode={darkMode}
          >
            兒
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="ST"
            darkMode={darkMode}
          >
            儿
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="J"
            darkMode={darkMode}
          >
            児
          </IndividualComponentCell>
          <IndividualComponentCell
            selected
            characterVariantLocales="S"
            darkMode={darkMode}
          >
            亻
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="JKST"
            darkMode={darkMode}
          >
            入
          </IndividualComponentCell>

          {new Array(radicalsPerRow - 6)
            .fill(undefined)
            .map((x, col: number) => (
              <IndividualComponentCell
                filler={true}
                // key={`filler-${index}-${col}`}
                selected={false}
              />
            ))}
        </NormalRow>
        The <Link to={{ pathname: "/pickers/components" }}>Components</Link>{" "}
        section retrieves various semantically and orthographically related
        characters, including all radicals and their conventional names - e.g.
        扌 from 手 and 疒 from 病. Double press 氵 and 亻 to add them to the
        "Components" input box in the Search section.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        ❷ Enter 月 into the "Components" input box in the Search section.
        Pressing the search button at this point will lead to the Results page
        containing our desired character; the combination of 氵, 亻, and 月 is
        more than sufficient to narrow it down.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        ❸ For instructional purposes, let's decompose 冬, a far more common
        character, to obtain its upper component, 夂. Return to the Components
        section, add 冬, and press <SearchIcon /> again. The following block
        will be added:
        <HeaderRow style={{ height: "45px" }}>冬</HeaderRow>
        <NormalRow style={{ height: "45px" }}>
          <IndividualComponentCell
            selected
            characterVariantLocales="S"
            darkMode={darkMode}
          >
            夂
          </IndividualComponentCell>
          <IndividualComponentCell darkMode={darkMode}>
            ⺀
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="S"
            darkMode={darkMode}
          >
            冫
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="JKT"
            darkMode={darkMode}
          >
            終
          </IndividualComponentCell>
          <IndividualComponentCell
            characterVariantLocales="S"
            darkMode={darkMode}
          >
            终
          </IndividualComponentCell>

          {new Array(radicalsPerRow - 5)
            .fill(undefined)
            .map((x, col: number) => (
              <IndividualComponentCell
                filler={true}
                // key={`filler-${index}-${col}`}
                selected={false}
              />
            ))}
        </NormalRow>
        Double press 夂 to add to the Search section, and press Search. The
        results should be narrowed down even further.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        ❹ If you happen to know that 修, a more common character, is a phonetic
        loan (假借) of the component on the right, 脩, you may use the related
        character finding capability of the Components section to obtain 脩.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        The{" "}
        <Button classes={buttonStyles}>
          <FormattedMessage
            id="componentspage.get_related"
            defaultMessage="Get related"
          />
        </Button>{" "}
        button in the lower pane is useful for recursively decomposing a
        character. 昚, an ancient character, can be obtained from the common 瞭
        or 遼 by first decomposing it into 尞, pressing said button with 尞
        selected, then pressing <SearchIcon /> once again. 瞭's IDS is defined
        as ⿰目尞; the characters in the immediate IDS of a character are
        included in its result block.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        Give retrieving <LargeSpan>釁</LargeSpan> using the more common{" "}
        <LargeSpan>興</LargeSpan> a try.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        What constitutes a variant may be found on{" "}
        <Link target="_blank" to={{ pathname: github }}>
          GitHub
        </Link>
        . The nature of the variant is indicated in the lower pane of a selected
        character, e.g. JA-Kakikae • JA-Joyo • KO-Basic • ZH-Traditional.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        A character with any of the following background colors is used in...
        {Object.keys(LocaleColorToName).map((key) => (
          <div style={{ paddingBottom: "5px", paddingTop: "5px" }}>
            <IconDescRow
              icon={
                <ColorDemoSquare
                  style={{
                    backgroundColor: darkMode
                      ? CharacterVariantLocaleColors[key].dark
                      : CharacterVariantLocaleColors[key].light,
                  }}
                />
              }
              desc={LocaleColorToName[key]}
            />
          </div>
        ))}
      </SectionParagraph>
    </>
  );
};

export default UsageSection;
