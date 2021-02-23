import { withTheme } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import FirstPage from "./components/FirstPage/desktop";

const DesktopAppScreenContainer = withTheme(styled.div`
  @media (max-width: 767px) {
    display: none;
  }

  height: 100%;
  overflow-y: scroll;
  transition: background-color 0.3s;
  background-color: ${(props) => props.theme.palette.background.default};
`);

const MainContainer = styled.div`
  min-height: 550px;
  overflow: hidden;
  height: 65vh;
  display: flex;

  border-bottom: 1px solid #909090;
`;

function DesktopAppScreen() {
  return (
    <DesktopAppScreenContainer id="app-screen-container-desktop">
      <MainContainer id="main-container-desktop">
        <FirstPage />
        {/* <ComponentsPage /> */}
      </MainContainer>
    </DesktopAppScreenContainer>
  );
}

export default DesktopAppScreen;
