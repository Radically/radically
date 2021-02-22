import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import FirstPage from "./components/FirstPage";
import ComponentsPage from "./components/ComponentsPage";
import ResultsPage from "./components/ResultsPage";

import { withTheme, makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";

// the bottom navigation
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

// material icons
import ShortTextIcon from "@material-ui/icons/ShortText";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";

import { SettingsContext } from "./contexts/SettingsContextProvider";

import OutputBar, { heightPx } from "./components/OutputBar";
import grey from "@material-ui/core/colors/grey";
import { useIntl } from "react-intl";
import teal from "@material-ui/core/colors/teal";
import AboutPage from "./components/AboutPage";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
  padding: 15px;
  box-sizing: border-box;
`;

const useStyles = makeStyles((theme: any) => ({
  stickToBottom: {
    width: "100%",
    // sticky only in mobile portrait mode
    // fixed is finicky especially with ff android
    "@media (orientation: portrait)": {
      "@supports (-moz-appearance:none)": {
        position: "sticky",
      },

      "@supports not (-moz-appearance:none)": {
        position: "fixed",
      },
    },
    bottom: 0,
    left: 0,
  },

  bottomNavigation: (props: { darkMode?: boolean }) => ({
    backgroundColor: props.darkMode ? null : theme.palette.primary.main,
  }),
}));

const useBottomNavigationStyles = makeStyles((theme: any) => ({
  root: (props: { darkMode?: boolean }) => ({
    "&$selected": {
      color: props.darkMode ? teal[300] : "white",
    },
    color: grey[300],
  }),

  selected: (props: { darkMode?: boolean }) => ({
    color: props.darkMode ? teal[300] : "white",
  }),
}));

function MobileAppScreen() {
  const { darkMode } = useContext(SettingsContext);
  const intl = useIntl();

  const isLandscape = useMediaQuery("(orientation: landscape)");

  const [showLandscapeAlert, setShowLandscapeAlert] = useState(false);
  // @ts-ignore
  const [showMobileChromeAlert, setShowMobileChromeAlert] = useState(false);
  const showAlertContainer = showLandscapeAlert || showMobileChromeAlert;

  useEffect(() => {
    setShowLandscapeAlert(isLandscape);
    // @ts-ignore
    setShowMobileChromeAlert(!!window.chrome && isLandscape);
  }, [isLandscape]);

  const [bottomNavValue, setBottomNavValue] = useState(0);

  const mobileAppScreenContainerRef = useRef<HTMLDivElement>(null);
  const componentsPageContainerRef = useRef<HTMLDivElement>(null);
  const resultsPageContainerRef = useRef<HTMLDivElement>(null);
  const aboutPageContainerRef = useRef<HTMLDivElement>(null);

  const firstPageBoundary = componentsPageContainerRef.current?.offsetLeft || 0;
  const secondPageBoundary = resultsPageContainerRef.current?.offsetLeft || 0;
  const thirdPageBoundary = aboutPageContainerRef.current?.offsetLeft || 0;

  const getIndex = (scrollPosition: number) => {
    if (scrollPosition < firstPageBoundary) {
      return 0;
    } else if (scrollPosition < secondPageBoundary) {
      return 1;
    } else if (scrollPosition < thirdPageBoundary) {
      return 2;
    }
    return 3;
  };

  const classes = useStyles({ darkMode });
  const bottomNavigationClasses = useBottomNavigationStyles({ darkMode });
  // android ff has a bug with scrolling to componentspage' offset
  const scrollBehavior = CSS.supports("(-moz-appearance:none)")
    ? "auto"
    : "smooth";

  const scrollToResults = () => {
    mobileAppScreenContainerRef.current?.scrollTo({
      left: resultsPageContainerRef.current?.offsetLeft,
      top: 0,
      behavior: scrollBehavior,
    });
  };

  return (
    <RootMobileContainer>
      {/* <div style={{ height: "100vh", backgroundColor: "red" }}>mobile</div> */}
      <MobileAppScreenContainer
        ref={mobileAppScreenContainerRef}
        onScroll={(e: React.UIEvent<HTMLElement>) => {
          const scrollPosition = (e.target as Element).scrollLeft;
          setBottomNavValue(getIndex(scrollPosition));
        }}
        id={"mobile-app-screen-container"}
      >
        <FirstPage scrollToResults={scrollToResults} />

        <StickyOutputBarWrapper id={"stickyoutputbarwrapper"}>
          {/* the results bar */}
          <OutputBar />
          <ComponentResultsPageWrapper id={"componentresultspagewrapper"}>
            <ComponentsPage containerRef={componentsPageContainerRef} />

            <ResultsPage containerRef={resultsPageContainerRef} />
          </ComponentResultsPageWrapper>
        </StickyOutputBarWrapper>
        <AboutPage containerRef={aboutPageContainerRef} />
      </MobileAppScreenContainer>

      <BottomNavigation
        value={bottomNavValue}
        className={classes.stickToBottom + " " + classes.bottomNavigation}
        /* value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }} */
        showLabels
      >
        <BottomNavigationAction
          classes={bottomNavigationClasses}
          onClick={() => {
            mobileAppScreenContainerRef.current?.scrollTo({
              left: 0,
              top: 0,
              behavior: scrollBehavior,
            });
          }}
          label={intl.formatMessage({
            id: "search",
          })}
          icon={<SearchIcon />}
        />

        <BottomNavigationAction
          classes={bottomNavigationClasses}
          onClick={() => {
            mobileAppScreenContainerRef.current?.scrollTo({
              left: componentsPageContainerRef.current?.offsetLeft,
              top: 0,
              behavior: scrollBehavior,
            });
          }}
          label={intl.formatMessage({
            id: "components",
          })}
          icon={
            <span
              style={{
                fontFamily: "var(--default-sans)",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              咅 阝
            </span>
          }
        />

        <BottomNavigationAction
          classes={bottomNavigationClasses}
          onClick={scrollToResults}
          label={intl.formatMessage({
            id: "results",
          })}
          icon={<ShortTextIcon />}
        />

        <BottomNavigationAction
          classes={bottomNavigationClasses}
          onClick={() => {
            mobileAppScreenContainerRef.current?.scrollTo({
              left: aboutPageContainerRef.current?.offsetLeft,
              top: 0,
              behavior: scrollBehavior,
            });
          }}
          label={intl.formatMessage({
            id: "about",
          })}
          icon={<InfoIcon />}
        />
      </BottomNavigation>

      {showAlertContainer && <InfoContainer>
        {showLandscapeAlert && <Alert severity="info" onClose={() => { setShowLandscapeAlert(false); }}>
          Landscape mode detected - scroll downwards to reveal the navbar!
        </Alert>}

        {showMobileChromeAlert && <Alert severity="error" onClose={() => { setShowMobileChromeAlert(false); }}>
          Regretfully, landscape mode performs suboptimally in mobile Chromium. Unexpected behavior, mostly abrupt jumps, may occur when using the pickers. Waiting for the momentum scrolling to finish or using the navbar can help mitigate this. Portrait mode is strongly recommended.
        </Alert>}
      </InfoContainer>}


    </RootMobileContainer>
  );
}

export default MobileAppScreen;
