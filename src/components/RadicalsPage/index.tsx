import { useContext, useState } from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Split from "react-split";

import { useIntl, FormattedDate } from "react-intl";
// for the radicals scroll container
import {
  FixedSizeList,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { outerElementType, RadicalPickerRow } from "./RadicalsScrollComponents";

import { heightPx } from "../OutputBar";

import CharacterResultReadings from "../CharacterResultReadings";

import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { DataContext } from "../../contexts/DataContextProvider";
import { arrayifyForReactWindow, strokeCountToRadicals } from "./utils";

const RadicalsPageContainer = styled("div")`
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

const StrokesRadicalsContainer = styled.div`
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

const LoadingTextContainer = withTheme(styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--default-sans);
  font-size: 1.5em;
  color: ${(props) => props.theme.palette.text.primary};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }

  animation: fadeIn 1s infinite alternate;
`);

const ls = [] as number[];
{
  for (let i = 1; i < 30; i++) {
    ls.push(i);
  }
}

interface SelectedInfo {
  index: number;
  col: number;
  radical: string;
}

function RadicalsPage() {
  const intl = useIntl();
  const [input, setInput] = useState("");

  const { darkMode } = useContext(SettingsContext);

  const {
    baseRadicals,
    baseRadicalsLoading,
    strokeCount,
    strokeCountLoading,

    readings,
    readingsLoading,
  } = useContext(DataContext);

  const strokeCountToRadicalsMap = strokeCountToRadicals(
    baseRadicals,
    strokeCount
  );

  const { arrayified, strokeCountToStart } = arrayifyForReactWindow(
    strokeCountToRadicalsMap
  );

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isSafari = navigator.vendor.includes("Apple");

  // radicals list handlers and methods begin here
  const [selectedInfo, setSelectedInfo] = useState({} as SelectedInfo);

  const radicalSelected = "index" in selectedInfo && "col" in selectedInfo;

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

  return (
    <RadicalsPageContainer id="radicals-page-container">
      <SearchContainer>
        <SearchInput
          placeholder={intl.formatMessage({
            id: "radicalspage.search_bar_placeholder",
          })}
        />

        <IconButton
          onClick={() => {
            // setDarkMode(!darkMode);
          }}
          color="primary"
          id="radical-search"
          aria-label="search and decompose the input characters"
          component="span"
        >
          <SearchIcon />
        </IconButton>
      </SearchContainer>

      <Split
        style={{ flex: 1 }}
        id="radicals-split-container"
        sizes={[75, 25]}
        minSize={isLandscape || isSafari ? 10 : 60} // 56px + 4
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={0}
        dragInterval={1}
        direction={"vertical"}
        cursor="col-resize"
      >
        <StrokesRadicalsContainer id={"strokes-radicals-container"}>
          <StrokesScrollContainer id={"strokes-scroll-container"}>
            {ls.map((count, idx) => (
              <div
                key={idx}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
              >
                {count}
              </div>
            ))}
          </StrokesScrollContainer>

          <RadicalsScrollContainer id="radicals-scroll-container">
            {baseRadicalsLoading && (
              <LoadingTextContainer darkMode={darkMode}>
                Loading...
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
                  // ref={radicalListRef}
                  height={height}
                  itemData={{ arrayified, selectedInfo, handleRadicalClick }}
                  itemCount={arrayified.length}
                  itemSize={40}
                  width={width}
                >
                  {RadicalPickerRow}
                </List>
              )}
            </AutoSizer>
          </RadicalsScrollContainer>
        </StrokesRadicalsContainer>

        <ReadingsScrollContainer>
          {readingsLoading && (
            <LoadingTextContainer darkMode={darkMode}>
              Loading...
            </LoadingTextContainer>
          )}
          {!radicalSelected && "No radical selected"}

          {radicalSelected && !readingsLoading && (
            <CharacterResultReadings
              key={selectedInfo.radical}
              char={selectedInfo.radical}
              readings={readings}
            />
          )}
        </ReadingsScrollContainer>
      </Split>
    </RadicalsPageContainer>
  );
}

export default RadicalsPage;
