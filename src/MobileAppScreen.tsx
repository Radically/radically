import { makeStyles, withTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Alert from "@material-ui/lab/Alert";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import AboutPage from "./components/AboutPage";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import SwipeableViews from "react-swipeable-views";

import BottomNavigator from "./components/BottomNavigator";
import { LandscapeHandle } from "./components/ComponentsBrowser";
import ComponentsPage from "./components/ComponentsPage";
import FirstPage from "./components/FirstPage/mobile";
import OutputBar, { heightPx } from "./components/OutputBar";
import ResultsPage from "./components/ResultsPage";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useRouteMatch,
} from "react-router-dom";
import { SwipeVelocityThreshold } from "./constants";

const RootMobileContainer = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  height: 100%;
`;

const MobileAppScreenContainer = withTheme(styled.div`
  @media (orientation: portrait) {
    height: calc(100% - 56px);
    @-moz-document url-prefix() {
      height: 100%;
      padding-bottom: 56px;
      box-sizing: border-box;
    }
  }

  @media (orientation: landscape) {
    height: 100%;
    // for android ff and chrome
    @supports not (-webkit-touch-callout: none) {
      height: 100vh;
    }
  }

  transition: background-color 0.3s;
  background-color: ${(props) => props.theme.palette.background.default};
`);

const InfoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 0px 15px; 15px;
  box-sizing: border-box;
`;

const useAlertStyles = makeStyles((theme: any) => ({
  root: {
    marginTop: "15px",
  },
}));

const LandscapeBarWrapper = styled.div`
  display: flex;
  flex: 1;
  max-height: calc(100% - ${heightPx}px);
`;

function ComponentResults() {
  return (
    <>
      <OutputBar />

      <SwipeableViews
        style={{ height: "100%" }}
        containerStyle={{
          height: "100%",
        }}
        slideStyle={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ComponentsPage />
        <ResultsPage />
      </SwipeableViews>
    </>
  );
}

function Routes() {
  const history = useHistory();

  const searchPageSwipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`/pickers/components`);
      }
    },
  });

  return (
    <MobileAppScreenContainer id={"mobile-app-screen-container"}>
      <SwipeableViews
        style={{ height: "100%" }}
        containerStyle={{
          height: "100%",
        }}
        slideStyle={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FirstPage />
        <ComponentResults />
        <AboutPage />
      </SwipeableViews>
    </MobileAppScreenContainer>
  );
}

function MobileAppScreen() {
  const history = useHistory();

  const isSafari = navigator.vendor.includes("Apple");

  const isLandscape = useMediaQuery(
    isSafari
      ? "screen and (orientation: landscape)"
      : "screen and (min-device-aspect-ratio: 1/1) and (orientation: landscape)"
  );

  const [showLandscapeAlert, setShowLandscapeAlert] = useState(false);
  // @ts-ignore
  const [showMobileChromeAlert, setShowMobileChromeAlert] = useState(false);
  const showAlertContainer = showLandscapeAlert || showMobileChromeAlert;

  const bottomNavigatorRef = useRef({
    onMobileAppScreenContainerScroll: (e: React.UIEvent<HTMLElement>) => {},
  });

  useEffect(() => {
    setShowLandscapeAlert(isLandscape);
    // @ts-ignore
    // setShowMobileChromeAlert(!!window.chrome && isLandscape);
  }, [isLandscape]);

  const alertStyles = useAlertStyles();

  console.log("main rerendering");

  return (
    <Router>
      <RootMobileContainer>
        <Routes />
        <BottomNavigator />

        {showAlertContainer && (
          <InfoContainer>
            {showLandscapeAlert && (
              <Alert
                classes={alertStyles}
                severity="info"
                onClose={() => {
                  setShowLandscapeAlert(false);
                }}
              >
                Landscape mode detected - scroll downwards to reveal the navbar!
              </Alert>
            )}

            {showMobileChromeAlert && (
              <Alert
                classes={alertStyles}
                severity="error"
                onClose={() => {
                  setShowMobileChromeAlert(false);
                }}
              >
                Regretfully, landscape mode performs suboptimally in mobile
                Chromium. Unexpected behavior, mostly abrupt jumps, may occur
                when using the pickers. Waiting for the momentum scrolling to
                finish or using the navbar can help mitigate this. Portrait mode
                is strongly recommended.
              </Alert>
            )}
          </InfoContainer>
        )}
      </RootMobileContainer>
    </Router>
  );
}

export default MobileAppScreen;
