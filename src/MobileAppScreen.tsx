import React, { useContext } from "react";
import styled from "styled-components";

import FirstPage from "./components/FirstPage";
import RadicalsPage from "./components/RadicalsPage";

import { withTheme, makeStyles } from "@material-ui/core/styles";

// the bottom navigation
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

// material icons
import ShortTextIcon from "@material-ui/icons/ShortText";
import SearchIcon from "@material-ui/icons/Search";
import TranslateIcon from "@material-ui/icons/Translate";

import { SettingsContext } from "./contexts/SettingsContextProvider";

import OutputBar, { heightPx } from "./components/OutputBar";

const RootMobileContainer = styled.div`
  @media (min-width: 768px) {
    display: none;
  }
  height: 100%;
`;

const MobileAppScreenContainer = withTheme(styled.div`
  height: 100%;
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

const RadicalResultsPageWrapper = styled.div`
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

    bottomNavigationAction: {
      color: "white",
    },
  }));

  const classes = useStyles();
  return (
    <RootMobileContainer>
      {/* <div style={{ height: "100vh", backgroundColor: "red" }}>mobile</div> */}
      <MobileAppScreenContainer id={"mobile-app-screen-container"}>
        <FirstPage />

        <StickyOutputBarWrapper id={"stickyoutputbarwrapper"}>
          {/* the results bar */}
          <OutputBar />
          <RadicalResultsPageWrapper id={"radicalresultspagewrapper"}>
            <RadicalsPage />

            <div
              style={{
                scrollSnapAlign: "start",
                backgroundColor: "yellow",
                height: "30px",
                minWidth: "100vw",
              }}
            ></div>
          </RadicalResultsPageWrapper>
        </StickyOutputBarWrapper>
      </MobileAppScreenContainer>

      <BottomNavigation
        className={classes.stickToBottom + " " + classes.bottomNavigation}
        /* value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }} */
        showLabels
      >
        <BottomNavigationAction
          className={classes.bottomNavigationAction}
          onClick={() => {}}
          label="Search"
          icon={<SearchIcon />}
        />

        <BottomNavigationAction
          className={classes.bottomNavigationAction}
          onClick={() => {}}
          label="Radicals"
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
          className={classes.bottomNavigationAction}
          onClick={() => {}}
          label="Output"
          icon={<ShortTextIcon />}
        />
      </BottomNavigation>
    </RootMobileContainer>
  );
}

export default MobileAppScreen;