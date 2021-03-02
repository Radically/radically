import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { SettingsContext } from "../../contexts/SettingsContextProvider";

import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { useWindowDimensions } from "../../utils";

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

interface BottomNavigatorProps {
  onSearchClick: React.MouseEventHandler<HTMLButtonElement>;
  onComponentsClick: React.MouseEventHandler<HTMLButtonElement>;
  onResultsClick: React.MouseEventHandler<HTMLButtonElement>;
  onAboutClick: React.MouseEventHandler<HTMLButtonElement>;
}

const BottomNavigator = forwardRef((props: BottomNavigatorProps, ref) => {
  const {
    onSearchClick,
    onComponentsClick,
    onResultsClick,
    onAboutClick,
  } = props;

  const [bottomNavValue, setBottomNavValue] = useState(0);
  const { width, height } = useWindowDimensions();

  useImperativeHandle(ref, () => ({
    onMobileAppScreenContainerScroll: (e: React.UIEvent<HTMLElement>) => {
      const newBottomNavValue = Math.floor(
        (e.target as Element).scrollLeft / (width || 1)
      );

      if (newBottomNavValue !== bottomNavValue)
        setBottomNavValue(newBottomNavValue);
    },
  }));

  const { darkMode } = useContext(SettingsContext);
  const intl = useIntl();

  const classes = useStyles({ darkMode });
  const bottomNavigationClasses = useBottomNavigationStyles({ darkMode });

  return (
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
        onClick={onSearchClick}
        label={intl.formatMessage({
          id: "search",
        })}
        icon={<SearchIcon />}
      />

      <BottomNavigationAction
        classes={bottomNavigationClasses}
        onClick={onComponentsClick}
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
        onClick={onResultsClick}
        label={intl.formatMessage({
          id: "results",
        })}
        icon={<ShortTextIcon />}
      />

      <BottomNavigationAction
        classes={bottomNavigationClasses}
        onClick={onAboutClick}
        label={intl.formatMessage({
          id: "about",
        })}
        icon={<InfoIcon />}
      />
    </BottomNavigation>
  );
});

export default BottomNavigator;
