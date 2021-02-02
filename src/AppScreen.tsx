import React, { useEffect, useRef, useState } from "react";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";
import DesktopAppScreen from "./DesktopAppScreen";
import MobileAppScreen from "./MobileAppScreen";

import "./App.css";
// import { SettingsContext } from "./contexts/SettingsContextProvider";

function AppScreen() {
  return (
    <SettingsContextProvider>
      <MobileAppScreen />
      <DesktopAppScreen />
    </SettingsContextProvider>
  );
}

export default AppScreen;
