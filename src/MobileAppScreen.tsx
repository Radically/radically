import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import FirstPage from "./components/FirstPage/mobile";
import ComponentsPage from "./components/ComponentsPage";
import ResultsPage from "./components/ResultsPage";

import { withTheme, makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

import { SettingsContext } from "./contexts/SettingsContextProvider";

import OutputBar, { heightPx } from "./components/OutputBar";
import AboutPage from "./components/AboutPage";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { LandscapeHandle } from "./components/ComponentsBrowser";

import BottomNavigator from "./components/BottomNavigator";

const RootMobileContainer = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  height: 100%;
`;

const MobileAppScreenContainer = withTheme(styled.div`
  @media (orientation: portrait) {
    height: calc(100% - 56px);
  }

  @media (orientation: landscape) {
    height: 100%;
    // for android ff and chrome
    @supports not (-webkit-touch-callout: none) {
      height: 100vh;
    }
  }

  // important for iOS !!!
  -webkit-overflow-scrolling: touch;
  -webkit-scroll-snap-type: mandatory;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;

  transition: background-color 0.3s;
  background-color: ${(props) => props.theme.palette.background.default};
`);

const StickyOutputBarWrapper = styled.div`
  height: 100%;
  // @media (orientation: landscape) {
  //   display: flex;
  //   flex-direction: column;
  // }
`;

const ComponentResultsPageWrapper = styled.div`
  display: flex;
  // @media (orientation: landscape) {
  //   flex: 1;
  // }

  // height instead of min-height
  // because i want it the contents to be scrollable
  // and not mess with the tab navigation
  height: calc(100% - ${heightPx}px);
`;

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

function MobileAppScreen() {
  const { darkMode } = useContext(SettingsContext);

  const isLandscape = useMediaQuery(
    "screen and (min-device-aspect-ratio: 1/1) and (orientation: landscape)"
  );

  const [showLandscapeAlert, setShowLandscapeAlert] = useState(false);
  // @ts-ignore
  const [showMobileChromeAlert, setShowMobileChromeAlert] = useState(false);
  const showAlertContainer = showLandscapeAlert || showMobileChromeAlert;

  const bottomNavigatorRef = useRef({
    onMobileAppScreenContainerScroll: (e: React.UIEvent<HTMLElement>) => {},
  });
  // const { width, height } = useWindowDimensions();

  useEffect(() => {
    setShowLandscapeAlert(isLandscape);
    // @ts-ignore
    setShowMobileChromeAlert(!!window.chrome && isLandscape);
  }, [isLandscape]);

  const mobileAppScreenContainerRef = useRef<HTMLDivElement>(null);
  const componentsPageContainerRef = useRef<HTMLDivElement>(null);
  const resultsPageContainerRef = useRef<HTMLDivElement>(null);
  const aboutPageContainerRef = useRef<HTMLDivElement>(null);

  const alertStyles = useAlertStyles();
  // android ff has a bug with scrolling to componentspage' offset
  const scrollBehavior = CSS.supports("(-moz-appearance:none)")
    ? "auto"
    : "smooth";

  const scrollToSearch = (e: React.MouseEvent) => {
    mobileAppScreenContainerRef.current?.scrollTo({
      left: 0,
      top: 0,
      behavior: scrollBehavior,
    });
  };

  const scrollToComponents = (e: React.MouseEvent) => {
    mobileAppScreenContainerRef.current?.scrollTo({
      left: componentsPageContainerRef.current?.offsetLeft,
      top: 0,
      behavior: scrollBehavior,
    });
  };

  const scrollToResults = () => {
    mobileAppScreenContainerRef.current?.scrollTo({
      left: resultsPageContainerRef.current?.offsetLeft,
      top: 0,
      behavior: scrollBehavior,
    });
  };

  const scrollToAbout = (e: React.MouseEvent) => {
    mobileAppScreenContainerRef.current?.scrollTo({
      left: aboutPageContainerRef.current?.offsetLeft,
      top: 0,
      behavior: scrollBehavior,
    });
  };

  const onScroll = (e: React.UIEvent<HTMLElement>) => {
    bottomNavigatorRef?.current.onMobileAppScreenContainerScroll(e);
  };

  return (
    <RootMobileContainer>
      {/* <div style={{ height: "100vh", backgroundColor: "red" }}>mobile</div> */}
      <MobileAppScreenContainer
        ref={mobileAppScreenContainerRef}
        onScroll={onScroll}
        id={"mobile-app-screen-container"}
      >
        <FirstPage scrollToResults={scrollToResults} />

        <StickyOutputBarWrapper id={"stickyoutputbarwrapper"}>
          {/* the results bar */}
          <OutputBar />
          <ComponentResultsPageWrapper id={"componentresultspagewrapper"}>
            <div style={{ display: "flex", minWidth: "100vw" }}>
              <ComponentsPage containerRef={componentsPageContainerRef} />

              {isLandscape && <LandscapeHandle />}
            </div>

            <div style={{ display: "flex", minWidth: "100vw" }}>
              <ResultsPage containerRef={resultsPageContainerRef} />

              {isLandscape && <LandscapeHandle />}
            </div>
          </ComponentResultsPageWrapper>
        </StickyOutputBarWrapper>
        <AboutPage containerRef={aboutPageContainerRef} />
      </MobileAppScreenContainer>

      <BottomNavigator
        ref={bottomNavigatorRef}
        onSearchClick={scrollToSearch}
        onComponentsClick={scrollToComponents}
        onResultsClick={scrollToResults}
        onAboutClick={scrollToAbout}
      />

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
              Chromium. Unexpected behavior, mostly abrupt jumps, may occur when
              using the pickers. Waiting for the momentum scrolling to finish or
              using the navbar can help mitigate this. Portrait mode is strongly
              recommended.
            </Alert>
          )}
        </InfoContainer>
      )}
    </RootMobileContainer>
  );
}

export default MobileAppScreen;
