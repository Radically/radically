import { useContext, useState } from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Split from "react-split";

import { heightPx } from "../OutputBar";

import { SettingsContext } from "../../contexts/SettingsContextProvider";

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
  @media (orientation: portrait) {
    border-bottom: 1px solid #909090;
  }
  // flex-grow: 1;
`;

const StrokesScrollContainer = styled.div`
  // flex: 0.1;
  width: 50px;
  float: left;

  background-color: green;
  border-right: 1px solid #909090;

  // do i really have to set a height here??
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
`;

const RadicalsScrollContainer = styled.div`
  // flex: 0.1;
  width: calc(100% - 51px);
  float: right;

  background-color: purple;

  // do i really have to set a height here??
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
`;

const ReadingsScrollContainer = styled.div`
  background-color: blue;
  flex-grow: 1;

  border-top: 1px solid #909090;
`;
const ls = [] as number[];
{
  for (let i = 1; i < 30; i++) {
    ls.push(i);
  }
}

function RadicalsPage() {
  const [input, setInput] = useState("");

  const { darkMode } = useContext(SettingsContext);

  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isSafari = navigator.vendor.includes("Apple");

  return (
    <RadicalsPageContainer id="radicals-page-container">
      <SearchContainer>
        <SearchInput placeholder="Find decompositions or variants" />

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
            {ls.map((count) => (
              <div
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

          <RadicalsScrollContainer id="radicals-scroll-container" />
        </StrokesRadicalsContainer>

        <ReadingsScrollContainer>blah32</ReadingsScrollContainer>
      </Split>
    </RadicalsPageContainer>
  );
}

export default RadicalsPage;
