import React from "react";

const defaultValue = {
  atLeastComponentFreq: false,
  setAtLeastComponentFreq: (unused: boolean) => {},

  darkMode: false,
  setDarkMode: (unused: boolean) => {},

  locale: "en",
  setLocale: (unused: string) => {},

  useWebWorker: false,
  setUseWebWorker: (unused: boolean) => {},

  installLastDismissed: new Date(0),
  setInstallLastDismissed: (unused: Date) => {},

  showInstall: true,
  setShowInstall: (unused: boolean) => {},
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
  const [atLeastComponentFreq, setAtLeastComponentFreq] = usePersistedState(
    "atLeastComponentFreqMatch",
    false
  );

  const [useWebWorker, setUseWebWorker] = usePersistedState(
    "useWebWorker",
    false
  );

  const [darkMode, setDarkMode] = usePersistedState(
    "darkMode",
    window.matchMedia("(prefers-color-scheme: dark)")
  );

  // for "internationalization"
  const [locale, setLocale] = usePersistedState("locale", "en");

  // for keeping track of when the install noti was last dismissed
  const [installLastDismissed, setInstallLastDismissed] = usePersistedState(
    "installLastDismissed",
    new Date(0)
  );

  // whether to show the install noti
  const [showInstall, setShowInstall] = usePersistedState("showInstall", true);

  const context = React.useMemo(
    () => ({
      atLeastComponentFreq,
      setAtLeastComponentFreq,
      darkMode,
      setDarkMode,
      locale,
      setLocale,
      useWebWorker,
      setUseWebWorker,

      installLastDismissed,
      setInstallLastDismissed,

      showInstall,
      setShowInstall,
    }),
    [
      atLeastComponentFreq,
      setAtLeastComponentFreq,
      darkMode,
      setDarkMode,
      locale,
      setLocale,
      useWebWorker,
      setUseWebWorker,
      installLastDismissed,
      setInstallLastDismissed,

      showInstall,
      setShowInstall,
    ]
  );

  return <SettingsContext.Provider value={context} {...props} />;
};
