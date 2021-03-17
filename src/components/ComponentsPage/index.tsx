import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
// import Split from "react-split";
import ComponentsReadingsSplit from "../ComponentsReadingsSplit";

import {
  // StrokesScrollContainer,
  StrokesScrollContainerSimpleBar,
  StrokesComponentsContainer,
  RadicalsScrollContainer,
  LoadingTextContainer,
  ReadingsScrollContainer,
  CenterTextContainer,
} from "../ComponentsBrowser";

import { useIntl, FormattedMessage } from "react-intl";
import { useSnackbar } from "notistack";

// for the components scroll container
import {
  FixedSizeList,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { SwipeableHandlers } from "react-swipeable";
import {
  outerElementType,
  ComponentPickerRow,
} from "../ComponentsScrollComponents";

import { heightPx } from "../OutputBar";

import CharacterResultReadings from "../CharacterResultReadings";

import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";
import {
  arrayifyForReactWindow,
  arrayifySearchResultsForReactWindow,
  getDecompositionAndVariants,
  strokeCountToRadicals,
} from "../ComponentsScrollComponents/utils";

import {
  getRadicalsPerRow,
  isCJK,
  notPositive,
  useWindowDimensions,
} from "../../utils";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";
import { widthPx } from "../FirstPage/desktop";
import { QuickToastContext } from "../../contexts/QuickToastContextProvider";
import { SelectedInfo } from "../../types/common";
import { ScrollOffsets } from "../../GlobalVariables";

export const searchInputHeightInPx = 45;

const ComponentsPageContainer = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    border-right: 1px solid #909090;
  }
`;

const SearchContainer = withTheme(styled.div`
  padding-right: 5px;
  padding-left: 10px;
  height: ${searchInputHeightInPx}px;
  background-color: ${(props) => props.theme.palette.background.paper};
  border-bottom: 1px solid #909090;
  display: flex;
`);

const SearchInput = withTheme(
  styled.input.attrs((props) => ({
    // we can define static props
    type: "search",

    // or we can define dynamic ones
    size: props.size || "0.5em",
  }))`
    flex: 1;
    height: ${searchInputHeightInPx}px;
    -webkit-appearance: none;
    outline: none;
    border: none;
    color: ${(props) => props.theme.palette.text.primary};
    background-color: transparent;
    font-size: 1em;
    font-family: var(--default-sans);
    font-weight: bold;
    box-sizing: border-box;
  `
);

function ComponentsPage(props: {
  containerRef?: React.Ref<HTMLDivElement>;
  desktop?: boolean;
}) {
  const { containerRef, desktop } = props;
  const intl = useIntl();
  // const [input, setInput] = useState("");
  const {
    relatedComponentsInput: input,
    setRelatedComponentsInput: setInput,
    componentsInput,
    setComponentsInput,

    componentsSelectedInfo: selectedInfo,
    setComponentsSelectedInfo: setSelectedInfo,

    componentsSearchResults: searchResults,
    setComponentsSearchResults: setSearchResults,
  } = useContext(SharedTextboxContext);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { darkMode } = useContext(SettingsContext);
  const { width, height } = useWindowDimensions();

  // as of the time of writing, display: none; is used to
  // hide the mobile view when the desktop viewport is shown;
  // however occasionally it has ZERO width
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

  const strokeCountToRadicalsMap = strokeCountToRadicals(
    baseRadicals,
    strokeCount
  );

  // radicals list handlers and methods begin here
  const componentSelected = "index" in selectedInfo && "col" in selectedInfo;

  const handleRadicalClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    col: number,
    radical: string
  ) => {
    // arrowKeyPressed.current = false;
    // if (selectedInfo.index === index && selectedInfo.col === col)
    //   onRadicalSelected(radical);
    if (selectedInfo.index === index && selectedInfo.col === col) {
      setComponentsInput(componentsInput + radical);
      enqueueSnackbar(
        intl.formatMessage({
          id: "added",
        }),
        {
          autoHideDuration: 800,
        }
      );
    }

    setSelectedInfo({ index, col, radical });
    event.stopPropagation();
    event.preventDefault();
    // pickerContainerRef.current?.focus();
  };
  // end here

  const componentListRef = useRef<FixedSizeList>(null);

  // search data structures & algos begin here
  // simple map of search input to results
  /* const [searchResults, setSearchResults] = useState(
    null as { [key: string]: string[] } | null
  ); */

  let arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[];
  let sideBarToStart: { [key: string]: number };
  if (!!searchResults) {
    ({
      arrayified,
      radicalToStart: sideBarToStart,
    } = arrayifySearchResultsForReactWindow(searchResults, radicalsPerRow));
  } else {
    ({
      arrayified,
      strokeCountToStart: sideBarToStart,
    } = arrayifyForReactWindow(strokeCountToRadicalsMap, intl, radicalsPerRow));
  }

  const performSearch = () => {
    setSelectedInfo({} as SelectedInfo); // unset the selected info
    const res = {} as { [key: string]: string[] };
    for (let char of input) {
      if (isCJK(char)) {
        const dv = getDecompositionAndVariants(
          char,
          reverseMapIDSOnly,
          variantsIslands
        );
        if (dv.length > 0) res[char] = dv;
      }
    }
    if (Object.entries(res).length > 0) {
      setSearchResults(res);
      // scroll to top
      if (!searchResults) componentListRef.current?.scrollTo(0);
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.key === "Enter") {
      if (!input) return;
      (e.target as HTMLInputElement).blur();
      performSearch();
    }
  };

  const [componentsScrollPosition, setComponentsScrollPosition] = useState(0);

  const onScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    ScrollOffsets.componentsPage = scrollOffset;
  };

  useEffect(() => {
    setComponentsScrollPosition(ScrollOffsets.componentsPage);
  }, []);

  return (
    <ComponentsPageContainer ref={containerRef} id="components-page-container">
      <SearchContainer>
        <SearchInput
          onKeyUp={handleEnterKey}
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // clear the search results
            if (!e.target.value) {
              setSelectedInfo({} as SelectedInfo);
              setSearchResults(null);
              componentListRef.current?.scrollTo(0);
            }
            setInput(e.target.value);
          }}
          placeholder={intl.formatMessage({
            id: "componentspage.search_bar_placeholder",
          })}
        />

        <IconButton
          disabled={!input}
          onClick={performSearch}
          color="primary"
          id="components-search"
          aria-label="search and decompose the input characters"
          component="span"
        >
          <SearchIcon />
        </IconButton>
      </SearchContainer>

      <ComponentsReadingsSplit
        id="components-page-split-container"
        negativePx={searchInputHeightInPx}
      >
        <StrokesComponentsContainer
          id={"components-page-strokes-components-container"}
        >
          <StrokesScrollContainerSimpleBar>
            {(!!searchResults
              ? Object.keys(searchResults)
              : Object.keys(strokeCountToRadicalsMap)
            ).map((count, idx) => (
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

          <RadicalsScrollContainer id="components-page-components-scroll-container">
            {baseRadicalsLoading && (
              <LoadingTextContainer darkMode={darkMode}>
                <FormattedMessage id="loading" defaultMessage="Loading..." />
              </LoadingTextContainer>
            )}

            <AutoSizer>
              {({ height, width }) => (
                <List
                  initialScrollOffset={componentsScrollPosition}
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
            />
          )}
        </ReadingsScrollContainer>
      </ComponentsReadingsSplit>
    </ComponentsPageContainer>
  );
}

export default ComponentsPage;
