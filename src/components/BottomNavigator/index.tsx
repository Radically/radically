import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { useHistory, useLocation } from "react-router-dom";

import { useContext } from "react";

import teal from "@material-ui/core/colors/teal";
import grey from "@material-ui/core/colors/grey";
import { useIntl } from "react-intl";

// material icons
import ShortTextIcon from "@material-ui/icons/ShortText";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";

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

const pathNameToIndex = {
  "/search": 0,
  "/pickers/components": 1,
  "/pickers/results": 2,
  "/about": 3,
} as { [key: string]: number };

const BottomNavigator = () => {
  const { darkMode } = useContext(SettingsContext);
  const intl = useIntl();

  const classes = useStyles({ darkMode });
  const bottomNavigationClasses = useBottomNavigationStyles({ darkMode });

  const history = useHistory();
  const { pathname } = useLocation();

  const navigateToSearch = (e: React.MouseEvent) => {
    history.replace("/search");
  };

  const navigateToComponents = (e: React.MouseEvent) => {
    history.replace("/pickers/components");
  };

  const navigateToResults = (e: React.MouseEvent) => {
    history.replace("/pickers/results");
  };

  const navigateToAbout = (e: React.MouseEvent) => {
    history.replace("/about");
  };

  return (
    <BottomNavigation
      data-testid="bottom-navigation"
      value={pathNameToIndex[pathname]}
      className={classes.stickToBottom + " " + classes.bottomNavigation}
      /* value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }} */
      showLabels
    >
      <BottomNavigationAction
        classes={bottomNavigationClasses}
        onClick={navigateToSearch}
        label={intl.formatMessage({
          id: "search",
        })}
        icon={<SearchIcon />}
      />

      <BottomNavigationAction
        classes={bottomNavigationClasses}
        onClick={navigateToComponents}
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
        onClick={navigateToResults}
        label={intl.formatMessage({
          id: "results",
        })}
        icon={<ShortTextIcon />}
      />

      <BottomNavigationAction
        classes={bottomNavigationClasses}
        onClick={navigateToAbout}
        label={intl.formatMessage({
          id: "about",
        })}
        icon={<InfoIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNavigator;
