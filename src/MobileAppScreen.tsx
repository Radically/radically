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

function MobileAppScreen() {
  const { darkMode } = useContext(SettingsContext);

  const useStyles = makeStyles((theme: any) => ({
    stickToBottom: {
      width: "100%",
      // sticky only in mobile portrait mode
      "@media (orientation: portrait)": {
        position: "sticky",
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

        <div
          id={"wrapper"}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <RadicalsPage />

            <div
              style={{
                scrollSnapAlign: "start",
                backgroundColor: "yellow",
                height: "30px",
                minWidth: "100vw",
              }}
            ></div>
          </div>

          {/* the results bar */}
          <div
            style={{
              position: "sticky",
              minWidth: "100vw",
              left: "0px",
              bottom: "56px",
              height: "50px",
              backgroundColor: "red",
            }}
          ></div>
        </div>
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
