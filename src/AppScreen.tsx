import React, { FunctionComponent } from "react";
import {
  SettingsContext,
  SettingsContextProvider,
} from "./contexts/SettingsContextProvider";

import {
  DataContext,
  DataContextProvider,
} from "./contexts/DataContextProvider";
import { SharedTextboxContextProvider } from "./contexts/SharedTextboxContextProvider";

import DesktopAppScreen from "./DesktopAppScreen";
import MobileAppScreen from "./MobileAppScreen";

import teal from "@material-ui/core/colors/teal";

import { useContext } from "react";

import "./App.css";
import {
  createMuiTheme,
  IconButton,
  makeStyles,
  MuiThemeProvider,
  PaletteType,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

import { IntlProvider } from "react-intl";
import i18n_data from "./i18n_data.json";
import { SnackbarProvider } from "notistack";
import { QuickToastContextProvider } from "./contexts/QuickToastContextProvider";
import QuickToast from "./components/QuickToast";
import { SearchContextProvider } from "./contexts/SearchContextProvider";
import ServiceWorkerStateProvider from "./contexts/ServiceWorkerStateProvider";
import { useIsMobile } from "./utils";
// import ServiceWorkerWrapper from "./components/ServiceWorkerWrapper";

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

const useSnackbarStyles = makeStyles(({ palette, breakpoints }) => ({
  // default variant
  contentRoot: {
    backgroundColor: teal[800],
    color: "white",
    // width: "100%",
  },
  collapseWrapperInner: {
    width: "100%",
  },
  root: {
    // width: "100%",
  },
  // for mobile!
  anchorOriginBottomRight: {
    [breakpoints.down(767)]: {
      bottom: 70,
    },
  },
  variantSuccess: {
    backgroundColor: `${teal[800]} !important`,
  },
  variantError: {
    backgroundColor: `${palette.error.dark} !important`,
  },
  variantInfo: {
    backgroundColor: `${palette.info.dark} !important`,
  },
  variantWarning: {
    backgroundColor: `${palette.warning.dark} !important`,
  },
}));

const useSnackbarButtonStyles = makeStyles({
  root: {
    color: "white",
  },
});

const SnackbarProviderWrapper = (props: { children: React.ReactElement }) => {
  const notistackRef = React.createRef<SnackbarProvider>();
  const onClickDismiss = (key: string) => () => {
    console.log("dismissing" + key);
    console.log(notistackRef.current);
    notistackRef.current?.closeSnackbar(key);
  };

  const { children } = props;
  const snackbarClasses = useSnackbarStyles();
  const snackbarButtonClasses = useSnackbarButtonStyles();

  return (
    <SnackbarProvider
      hideIconVariant={false}
      maxSnack={10}
      classes={snackbarClasses}
      ref={notistackRef}
      dense={true}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transitionDuration={{ enter: 100, exit: 50 }}
      action={(key: string) => (
        <IconButton
          classes={snackbarButtonClasses}
          color="primary"
          size="small"
          aria-label="close-notification"
          onClick={onClickDismiss(key)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  );
};

function AppScreen() {
  const isMobile = useIsMobile();

  return (
    <SettingsContextProvider>
      {/* <ServiceWorkerWrapper /> */}

      <AppScreenMuiThemeWrapper>
        <ServiceWorkerStateProvider>
          {/* <QuickToastContextProvider>
            <QuickToast /> */}

          <SnackbarProviderWrapper>
            <DataContextProvider>
              <SharedTextboxContextProvider>
                <SearchContextProvider>
                  <ReactIntlWrapper>
                    {isMobile ? <MobileAppScreen /> : <DesktopAppScreen />}
                  </ReactIntlWrapper>
                </SearchContextProvider>
              </SharedTextboxContextProvider>
            </DataContextProvider>
          </SnackbarProviderWrapper>
          {/* </QuickToastContextProvider> */}
        </ServiceWorkerStateProvider>
      </AppScreenMuiThemeWrapper>
    </SettingsContextProvider>
  );
}

export default AppScreen;
