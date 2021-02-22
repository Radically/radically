import { useContext, useEffect, useRef, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import styled from "styled-components";
import { SearchContext } from "../../contexts/SearchContextProvider";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";
import { getRadicalsPerRow, useWindowDimensions } from "../../utils";

import {
  FixedSizeList,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";

import AutoSizer from "react-virtualized-auto-sizer";

import {
  CenterTextContainer,
  RadicalsScrollContainer,
  LoadingTextContainer,
  ReadingsScrollContainer,
  StrokesComponentsContainer,
  StrokesScrollContainer,
} from "../ComponentsBrowser";

import ComponentsReadingSplit from "../ComponentsReadingsSplit";
import { heightPx } from "../OutputBar";
import {
  arrayifyForReactWindow,
  strokeCountToRadicals,
} from "../ComponentsScrollComponents/utils";
import { DataContext } from "../../contexts/DataContextProvider";
import {
  ComponentPickerRow,
  outerElementType,
} from "../ComponentsScrollComponents";
import CharacterResultReadings from "../CharacterResultReadings";

const ResultsPageContainer = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // height: 100%;
  // position: relative;

  scroll-snap-align: start;
  // min-width: 100vw;

  // for mobile safari
  // 56px is the height of the MUI bottom navbar
  /* @supports (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      margin-bottom: calc(56px + ${heightPx}px);
    }
  } */
`;

interface SelectedInfo {
  index: number;
  col: number;
  radical: string;
}

function ResultsPage(props: { containerRef?: React.Ref<HTMLDivElement> }) {
  const { containerRef } = props;
  const intl = useIntl();
  const { darkMode } = useContext(SettingsContext);
  const { searchResults } = useContext(SearchContext);

  const {
    relatedComponentsInput: input,
    setRelatedComponentsInput: setInput,
  } = useContext(SharedTextboxContext);

  const { width, height } = useWindowDimensions();
  const radicalsPerRow = getRadicalsPerRow(width || 320);

  const {
    baseRadicals,
    baseRadicalsLoading,
    strokeCount,
    strokeCountLoading,

    readings,
    readingsLoading,

    reverseMapIDSOnly,
    variantsIslands,
  } = useContext(DataContext);

  // radicals list handlers and methods begin here
  const [selectedInfo, setSelectedInfo] = useState({} as SelectedInfo);

  useEffect(() => {
    setSelectedInfo({} as SelectedInfo);
  }, [searchResults]);

  const componentSelected = "index" in selectedInfo && "col" in selectedInfo;

  const handleRadicalClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    col: number,
    radical: string
  ) => {
    setSelectedInfo({ index, col, radical });
    event.stopPropagation();
    event.preventDefault();
  };
  // end here

  const componentListRef = useRef<FixedSizeList>(null);

  let arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[];

  let sideBarToStart: { [key: string]: number };

  const strokeCountToRadicalsMap = strokeCountToRadicals(
    searchResults,
    strokeCount
  );

  ({ arrayified, strokeCountToStart: sideBarToStart } = arrayifyForReactWindow(
    strokeCountToRadicalsMap,
    intl,
    radicalsPerRow
  ));

  return (
    <ResultsPageContainer ref={containerRef} id="results-page-container">
      <ComponentsReadingSplit id="results-page-split-container">
        <StrokesComponentsContainer
          id={"results-page-strokes-components-container"}
        >
          <StrokesScrollContainer id={"results-page-strokes-scroll-container"}>
            {Object.keys(strokeCountToRadicalsMap).map((count, idx) => (
              <div
                key={idx}
                onClick={() => {
                  componentListRef?.current?.scrollToItem(
                    sideBarToStart[count],
                    "center"
                  );
                }}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  cursor: "pointer",
                  fontSize: count === "999" ? "0.8rem" : "1rem",
                }}
              >
                {count === "999"
                  ? intl.formatMessage({
                    id: "unclear",
                  })
                  : count}
              </div>
            ))}
          </StrokesScrollContainer>
          <RadicalsScrollContainer id="results-page-components-scroll-container">
            {!searchResults.length && (
              <CenterTextContainer darkMode={darkMode}>
                <FormattedMessage id="no_results" defaultMessage="No results" />
              </CenterTextContainer>
            )}

            {!!searchResults.length && (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    style={{
                      color: darkMode ? "white" : "black",
                      fontWeight: "bold",
                    }}
                    outerElementType={outerElementType}
                    // outerRef={listOuterRef}
                    ref={componentListRef}
                    height={height}
                    itemData={{
                      radicalsPerRow,
                      arrayified,
                      selectedInfo,
                      handleRadicalClick,
                    }}
                    itemCount={arrayified.length}
                    itemSize={40}
                    width={width}
                  >
                    {ComponentPickerRow}
                  </List>
                )}
              </AutoSizer>
            )}
          </RadicalsScrollContainer>
        </StrokesComponentsContainer>

        <ReadingsScrollContainer>
          {readingsLoading && (
            <LoadingTextContainer darkMode={darkMode}>
              <FormattedMessage id="loading" defaultMessage="Loading..." />
            </LoadingTextContainer>
          )}
          {!componentSelected && (
            <CenterTextContainer darkMode={darkMode}>
              <FormattedMessage
                id="no_radical_selected"
                defaultMessage="No radical selected"
              />
            </CenterTextContainer>
          )}

          {componentSelected && !readingsLoading && (
            <CharacterResultReadings
              key={selectedInfo.radical}
              char={selectedInfo.radical}
              readings={readings}
              toastOnGetRelated
            />
          )}
        </ReadingsScrollContainer>
      </ComponentsReadingSplit>
    </ResultsPageContainer>
  );
}

export default ResultsPage;
