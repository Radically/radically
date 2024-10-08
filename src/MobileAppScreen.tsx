import { makeStyles, withTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useRef, useState } from "react";
import ServiceWorkerLifecycle from "./ServiceWorkerLifecycle";
import styled from "styled-components";
import { useSnackbar } from "notistack";

import AboutPage from "./components/AboutPage";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
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
import { useIsMobileLandscape } from "./utils";
import { useIntl } from "react-intl";

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

const LandscapeBarWrapper = styled.div<{ outputBar?: boolean }>`
  display: flex;
  flex: 1;
  max-height: calc(100% - ${(props) => (props.outputBar ? heightPx : 0)}px);
`;

function ComponentResults() {
  let { path, url } = useRouteMatch();

  const isSafari = navigator.vendor.includes("Apple");

  const isLandscape = useIsMobileLandscape();

  const history = useHistory();

  const componentsPageSwipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`${path}/results`);
      }
    },
    onSwipedRight: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`/search`);
      }
    },
  });

  const resultsPageSwipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`/about`);
      }
    },
    onSwipedRight: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`${path}/components`);
      }
    },
  });

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <OutputBar />
      <Switch>
        <Route exact path={path}>
          <Redirect to={`${path}/components`} />
        </Route>

        <Route exact path={`${path}/components`}>
          <LandscapeBarWrapper outputBar {...componentsPageSwipeHandlers}>
            <ComponentsPage />
            {isLandscape && <LandscapeHandle />}
          </LandscapeBarWrapper>
        </Route>

        <Route exact path={`${path}/results`}>
          <LandscapeBarWrapper outputBar {...resultsPageSwipeHandlers}>
            <ResultsPage />
            {isLandscape && <LandscapeHandle />}
          </LandscapeBarWrapper>
        </Route>
      </Switch>
    </div>
  );
}

function Routes() {
  const history = useHistory();

  const isSafari = navigator.vendor.includes("Apple");

  const isLandscape = useIsMobileLandscape();

  const searchPageSwipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`/pickers/components`);
      }
    },
  });

  const aboutPageSwipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
      const { velocity } = eventData;
      if (velocity >= SwipeVelocityThreshold) {
        history.replace(`/pickers/results`);
      }
    },
  });

  return (
    <MobileAppScreenContainer id={"mobile-app-screen-container"}>
      <Route exact path="/">
        <Redirect to="/search" />
      </Route>

      <Route exact path="/search">
        <div
          {...searchPageSwipeHandlers}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FirstPage />
        </div>
      </Route>

      <Route path="/pickers">
        <ComponentResults />
      </Route>

      <Route path="/about">
        <LandscapeBarWrapper {...aboutPageSwipeHandlers}>
          <AboutPage />
          {isLandscape && <LandscapeHandle />}
        </LandscapeBarWrapper>
      </Route>
    </MobileAppScreenContainer>
  );
}

// let landscapeModeTipHandle: string | number | undefined = undefined;

function MobileAppScreen() {
  const intl = useIntl();
  // const isSafari = navigator.vendor.includes("Apple");
  // const isMobile = useIsMobile();
  const isLandscape = useIsMobileLandscape();

  const [showLandscapeAlert, setShowLandscapeAlert] = useState(false);
  // @ts-ignore
  const [showMobileChromeAlert, setShowMobileChromeAlert] = useState(false);
  const showAlertContainer = showLandscapeAlert || showMobileChromeAlert;

  const bottomNavigatorRef = useRef({
    onMobileAppScreenContainerScroll: (e: React.UIEvent<HTMLElement>) => {},
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    // setShowLandscapeAlert(isLandscape);

    if (isLandscape)
      enqueueSnackbar(
        intl.formatMessage({
          id: "landscape_notif",
        }),
        {
          variant: "info",
          key: "landscape-mode-tip",
          preventDuplicate: true,
          persist: true,
        }
      );
    else closeSnackbar("landscape-mode-tip");
    // @ts-ignore
    // setShowMobileChromeAlert(!!window.chrome && isLandscape);
  }, [isLandscape]);

  const alertStyles = useAlertStyles();

  return (
    <Router>
      <ServiceWorkerLifecycle />
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
