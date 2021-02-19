import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";

import FirstPage from "./components/FirstPage";
import ComponentsPage from "./components/ComponentsPage";
import ResultsPage from "./components/ResultsPage";

import { withTheme, makeStyles } from "@material-ui/core/styles";

// the bottom navigation
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

// material icons
import ShortTextIcon from "@material-ui/icons/ShortText";
import SearchIcon from "@material-ui/icons/Search";

import { SettingsContext } from "./contexts/SettingsContextProvider";

import OutputBar, { heightPx } from "./components/OutputBar";
import grey from "@material-ui/core/colors/grey";
import { useIntl } from "react-intl";
import teal from "@material-ui/core/colors/teal";

const RootMobileContainer = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  height: 100%;
`;

const MobileAppScreenContainer = withTheme(styled.div`
  height: 100%;

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
  @media (orientation: landscape) {
    display: flex;
    flex-direction: column;
  }
`;

const ComponentResultsPageWrapper = styled.div`
  display: flex;
  @media (orientation: landscape) {
    flex: 1;
  }

  // mobile safari's definition of 100% when there
  // is a sticky element on the screen is different from
  // ff android and chrome android's definition
  @supports (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      height: 100%;
    }
  }

  @supports (not (-webkit-touch-callout: none)) {
    @media (orientation: portrait) {
      // height instead of min-height
      // because i want it the contents to be scrollable
      // and not mess with the tab navigation
      height: calc(100% - ${heightPx}px);
    }
  }
`;


function MobileAppScreen() {
  const { darkMode } = useContext(SettingsContext);
  const intl = useIntl();

  const [bottomNavValue, setBottomNavValue] = useState(0);

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

    bottomNavigation: {
      backgroundColor: darkMode ? null : theme.palette.primary.main,
    },
  }));

  const useBottomNavigationStyles = makeStyles((theme: any) => ({
    root: {
      "&$selected": {
        color: darkMode ? teal[300]: "white",
      },
      color: grey[300],
    },
    selected: {
      color: darkMode ? teal[300]: "white",
    },
  }));

  const mobileAppScreenContainerRef = useRef<HTMLDivElement>(null);
  const componentsPageContainerRef = useRef<HTMLDivElement>(null);
  const resultsPageContainerRef = useRef<HTMLDivElement>(null);

  const firstPageBoundary = componentsPageContainerRef.current?.offsetLeft || 0;
  const secondPageBoundary = resultsPageContainerRef.current?.offsetLeft || 0;

  const getIndex = (scrollPosition: number) => {
    if (scrollPosition < firstPageBoundary) {
      return 0;
    } else if (scrollPosition < secondPageBoundary) {
      return 1;
    }
    return 2;
  };

  const classes = useStyles();
  const bottomNavigationClasses = useBottomNavigationStyles();

  const scrollToResults = () => {
    mobileAppScreenContainerRef.current?.scrollTo({
      left: resultsPageContainerRef.current?.offsetLeft,
      top: 0,
      behavior: "smooth",
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
              behavior: "smooth",
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
              behavior: "smooth",
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
      </BottomNavigation>
    </RootMobileContainer>
  );
}

export default MobileAppScreen;
