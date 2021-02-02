import React from "react";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const defaultValue = {
  exactRadicalFreq: false,
  setExactRadicalFreq: (unused: boolean) => {},

  darkMode: false,
  setDarkMode: (unused: boolean) => {},
};

export const SettingsContext = React.createContext(defaultValue);

const usePersistedState = (key: string, defaultValue: any) => {
  const [state, setState] = React.useState(() => {
    const persistedState = localStorage.getItem(key);
    return persistedState ? JSON.parse(persistedState) : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);
  return [state, setState];
};

// TODO: figure out the typing of props lol (should be a react component or styled component)
export const SettingsContextProvider = (props: { children: any }) => {
  const [exactRadicalFreq, setExactRadicalFreq] = usePersistedState(
    "exactRadicalFreqMatch",
    false
  );

  const [darkMode, setDarkMode] = usePersistedState(
    "darkMode",
    useMediaQuery("(prefers-color-scheme: dark)")
  );

  const context = React.useMemo(
    () => ({ exactRadicalFreq, setExactRadicalFreq, darkMode, setDarkMode }),
    [exactRadicalFreq, setExactRadicalFreq, darkMode, setDarkMode]
  );

  return <SettingsContext.Provider value={context} {...props} />;
};
