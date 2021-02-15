import React, { useState } from "react";

const defaultDuration = 1500;

const defaultValue = {
  snackbarText: "",
  open: false,
  close: () => {},
  duration: defaultDuration,
  showText: (unused: string, duration: number = defaultDuration) => {},
};

export const QuickToastContext = React.createContext(defaultValue);

export const QuickToastContextProvider = (props: { children: any }) => {
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [duration, setDuration] = useState(defaultDuration);

  const showText = (text: string, duration: number = defaultDuration) => {
    setDuration(duration);
    setSnackbarText(text);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const context = {
    snackbarText,
    open,
    close,
    duration,
    showText,
  };

  return <QuickToastContext.Provider value={context} {...props} />;
};
