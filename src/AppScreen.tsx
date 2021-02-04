import React, { FunctionComponent } from "react";
import {
  SettingsContext,
  SettingsContextProvider,
} from "./contexts/SettingsContextProvider";

import DesktopAppScreen from "./DesktopAppScreen";
import MobileAppScreen from "./MobileAppScreen";

import teal from "@material-ui/core/colors/teal";

import { useContext } from "react";

import "./App.css";
import {
  createMuiTheme,
  MuiThemeProvider,
  PaletteType,
} from "@material-ui/core";

// material ui theming needed for the icons
const AppScreenMuiThemeWrapper: FunctionComponent<{}> = (props) => {
  const { children } = props;
  const { darkMode } = useContext(SettingsContext);

  const themeObject = {
    palette: {
      type: (darkMode ? "dark" : "light") as PaletteType,
      primary: {
        main: darkMode ? teal[300] : teal[800],
      },
    },
  };
  const themeConfig = createMuiTheme(themeObject);

  return <MuiThemeProvider theme={themeConfig}>{children}</MuiThemeProvider>;
};

function AppScreen() {
  return (
    <SettingsContextProvider>
      <AppScreenMuiThemeWrapper>
        <MobileAppScreen />
        <DesktopAppScreen />
      </AppScreenMuiThemeWrapper>
    </SettingsContextProvider>
  );
}

export default AppScreen;
