import { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Split from "react-split";

import { useIntl, FormattedDate, FormattedMessage } from "react-intl";
// for the components scroll container
import {
  FixedSizeList,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  outerElementType,
  ComponentPickerRow,
} from "./ComponentsScrollComponents";

import { heightPx } from "../OutputBar";

import CharacterResultReadings from "../CharacterResultReadings";

import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";
import {
  arrayifyForReactWindow,
  arrayifySearchResultsForReactWindow,
  getDecompositionAndVariants,
  getRadicalsPerRow,
  strokeCountToRadicals,
} from "./utils";
import { isCJK, useWindowDimensions } from "../../utils";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";

const ComponentsPageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // height: 100%;
  // position: relative;

  scroll-snap-align: start;
  min-width: 100vw;

  // for mobile safari
  // 56px is the height of the MUI bottom navbar
  @supports (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      margin-bottom: calc(56px + ${heightPx}px);
    }
  }
`;

const SearchContainer = withTheme(styled.div`
  padding-right: 5px;
  padding-left: 10px;
  height: 45px;
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
    height: 45px;
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

const StrokesComponentsContainer = styled.div`
  // @media (orientation: portrait) {
  border-bottom: 1px solid #909090;
  // }
  // flex-grow: 1;
`;

const StrokesScrollContainer = withTheme(styled.div`
  // flex: 0.1;
  width: 50px;
  float: left;

  // background-color: green;
  border-right: 1px solid #909090;

  // do i really have to set a height here??
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;

  color: ${(props) => props.theme.palette.text.primary};
`);

const RadicalsScrollContainer = styled.div`
  // flex: 0.1;
  width: calc(100% - 51px - 10px - 10px);
  float: right;

  // background-color: purple;

  // do i really have to set a height here??
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;

  padding-left: 10px;
  padding-right: 10px;
`;

const ReadingsScrollContainer = withTheme(styled.div`
  // background-color: blue;
  flex-grow: 1;
  overflow-y: scroll;

  border-top: 1px solid #909090;
  color: ${(props) => props.theme.palette.text.primary};
`);

const CenterTextContainer = withTheme(styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--default-sans);
  font-size: 1.5em;
  // font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
`);

const LoadingTextContainer = withTheme(styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--default-sans);
  font-size: 1.5em;
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }

  animation: fadeIn 1s infinite alternate;
`);

interface SelectedInfo {
  index: number;
  col: number;
  radical: string;
}

function ComponentsPage() {
  const intl = useIntl();
  // const [input, setInput] = useState("");
  const {
    relatedComponentsInput: input,
    setRelatedComponentsInput: setInput,
  } = useContext(SharedTextboxContext);

  const { darkMode } = useContext(SettingsContext);
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

  const strokeCountToRadicalsMap = strokeCountToRadicals(
    baseRadicals,
    strokeCount
  );

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isSafari = navigator.vendor.includes("Apple");

  // radicals list handlers and methods begin here
  const [selectedInfo, setSelectedInfo] = useState({} as SelectedInfo);

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
    setSelectedInfo({ index, col, radical });
    event.stopPropagation();
    event.preventDefault();
    // pickerContainerRef.current?.focus();
  };
  // end here

  const componentListRef = useRef<FixedSizeList>(null);

  // search data structures & algos begin here
  // simple map of search input to results
  const [searchResults, setSearchResults] = useState(
    null as { [key: string]: string[] } | null
  );

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
    }
  };

  return (
    <ComponentsPageContainer id="components-page-container">
      <SearchContainer>
        <SearchInput
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // clear the search results
            if (!e.target.value) {
              setSelectedInfo({} as SelectedInfo);
              setSearchResults(null);
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

      <Split
        style={{ flex: 1 }}
        id="components-split-container"
        sizes={[60, 40]}
        minSize={isLandscape || isSafari ? 10 : 60} // 56px + 4
        expandToMin={true}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={0}
        dragInterval={1}
        direction={"vertical"}
        cursor="col-resize"
      >
        <StrokesComponentsContainer id={"strokes-components-container"}>
          <StrokesScrollContainer id={"strokes-scroll-container"}>
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
          </StrokesScrollContainer>

          <RadicalsScrollContainer id="components-scroll-container">
            {baseRadicalsLoading && (
              <LoadingTextContainer darkMode={darkMode}>
                <FormattedMessage id="loading" defaultMessage="Loading..." />
              </LoadingTextContainer>
            )}

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
                id="componentspage.no_radical_selected"
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
      </Split>
    </ComponentsPageContainer>
  );
}

export default ComponentsPage;
