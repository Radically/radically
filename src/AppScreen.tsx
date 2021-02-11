import React, { FunctionComponent } from "react";
import {
  SettingsContext,
  SettingsContextProvider,
} from "./contexts/SettingsContextProvider";

import {
  DataContext,
  DataContextProvider,
} from "./contexts/DataContextProvider";

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

import { IntlProvider } from "react-intl";
import i18n_data from "./i18n_data.json";

const i18n = i18n_data as { [key: string]: any };

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

/* how preposterous would it be for such a useful 
hanzi-related tool to not have a *han* translation?

漢字之利器，如無漢譯，不亦謬乎？ */

const ReactIntlWrapper: FunctionComponent<{}> = (props) => {
  const { children } = props;
  const { locale } = useContext(SettingsContext);
  return (
    <IntlProvider locale={locale} messages={i18n[locale]}>
      {children}
    </IntlProvider>
  );
};

function AppScreen() {
  return (
    <SettingsContextProvider>
      <AppScreenMuiThemeWrapper>
        <DataContextProvider>
          <ReactIntlWrapper>
            <MobileAppScreen />
            <DesktopAppScreen />
          </ReactIntlWrapper>
        </DataContextProvider>
      </AppScreenMuiThemeWrapper>
    </SettingsContextProvider>
  );
}

export default AppScreen;
