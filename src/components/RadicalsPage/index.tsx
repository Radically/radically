import { useState } from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
// import ResizePanel from "react-resize-panel";

import { heightPx } from "../OutputBar";

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

function RadicalsPage() {
  const [input, setInput] = useState("");

  return (
    <RadicalsPageContainer id="radicals-page-container">
      <SearchContainer>
        <SearchInput placeholder="食喜" />

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

      <div style={{ backgroundColor: "green", flexGrow: 2 }}></div>

      {/* <ResizePanel direction="n">
        <div style={{ backgroundColor: "blue", flexGrow: 1 }}>blah</div>
      </ResizePanel> */}
    </RadicalsPageContainer>
  );
}

export default RadicalsPage;
