import { withTheme } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ComponentsPage from "./components/ComponentsPage";
import FirstPage from "./components/FirstPage/desktop";
import OutputBar from "./components/OutputBar";
import ResultsPage from "./components/ResultsPage";

const DesktopAppScreenContainer = withTheme(styled.div`
  @media (max-width: 767px) {
    display: none;
  }

  height: 100%;
  overflow-y: scroll;
  transition: background-color 0.3s;
  background-color: ${(props) => props.theme.palette.background.default};

  // iPhone X and above notches / safe areas
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
`);

const MainContainer = styled.div`
  min-height: 550px;
  overflow: hidden;
  height: 80vh;
  display: flex;

  border-bottom: 1px solid #909090;
`;

function DesktopAppScreen() {
  return (
    <DesktopAppScreenContainer id="app-screen-container-desktop">
      <MainContainer id="main-container-desktop">
        <FirstPage />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "100%", flex: 1, display: "flex" }}>
            <ComponentsPage desktop />
            <ResultsPage desktop />
          </div>

          <OutputBar />
        </div>
      </MainContainer>

      <div>
        blah blah this is the about section blah blah this is the about section
        blah blah this is the about section blah blah this is the about section
        blah blah this is the about section blah blah this is the about section
        blah blah this is the about section blah blah this is the about
        sectionblah blah this is the about section blah blah this is the about
        sectionblah blah this is the about section blah blah this is the about
        section blah blah this is the about section
      </div>
    </DesktopAppScreenContainer>
  );
}

export default DesktopAppScreen;
