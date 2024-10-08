import { useContext, useEffect, useRef, useState } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import styled from "styled-components";
import { SearchContext } from "../../contexts/SearchContextProvider";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";
import {
  getRadicalsPerRow,
  notPositive,
  useWindowDimensions,
} from "../../utils";

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
  // StrokesScrollContainer,
  StrokesScrollContainerSimpleBar,
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
import { widthPx } from "../FirstPage/desktop";
import { ScrollOffsets } from "../../GlobalVariables";

const ResultsPageContainer = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function ResultsPage(props: {
  containerRef?: React.Ref<HTMLDivElement>;
  desktop?: boolean;
}) {
  const { containerRef, desktop } = props;
  const intl = useIntl();
  const { darkMode } = useContext(SettingsContext);
  const { searchResults } = useContext(SearchContext);

  const {
    output,
    setOutput,

    resultsSelectedInfo: selectedInfo,
    setResultsSelectedInfo: setSelectedInfo,
  } = useContext(SharedTextboxContext);

  const { width, height } = useWindowDimensions();
  const radicalsPerRow = notPositive(
    getRadicalsPerRow(
      !!desktop && !!width && width > widthPx
        ? (width - widthPx) / 2
        : width || 320
    ),
    10
  );

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
  const componentSelected = "index" in selectedInfo && "col" in selectedInfo;

  const handleRadicalClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    col: number,
    radical: string
  ) => {
    if (selectedInfo.index === index && selectedInfo.col === col) {
      setOutput(output + radical);
    }

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

  const [resultsScrollPosition, setResultsScrollPosition] = useState(0);
  const onScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    ScrollOffsets.resultsPage = scrollOffset;
  };

  useEffect(() => {
    setResultsScrollPosition(ScrollOffsets.resultsPage);
  }, []);

  return (
    <ResultsPageContainer
      ref={containerRef}
      data-testid="results-page-container"
      id="results-page-container"
    >
      <ComponentsReadingSplit id="results-page-split-container">
        <StrokesComponentsContainer
          id={"results-page-strokes-components-container"}
        >
          <StrokesScrollContainerSimpleBar
            id={"results-page-strokes-scroll-container"}
          >
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
          </StrokesScrollContainerSimpleBar>

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
                    initialScrollOffset={resultsScrollPosition}
                    onScroll={onScroll}
                    style={{
                      color: darkMode ? "white" : "black",
                      // fontWeight: "bold",
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
                    itemSize={45}
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
