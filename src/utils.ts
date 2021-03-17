import { useMediaQuery } from "@material-ui/core";
import { useRef, useState, useEffect } from "react";
import { IDCSet, StrokePlaceholderSet } from "./constants";

import * as React from "react";

interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useAddToHomescreenPrompt(): [
  IBeforeInstallPromptEvent | null,
  () => void
] {
  const [prompt, setState] = React.useState<IBeforeInstallPromptEvent | null>(
    null
  );

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt();
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    );
  };

  React.useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      setState(e);
    };

    window.addEventListener("beforeinstallprompt", ready as any);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready as any);
    };
  }, []);

  return [prompt, promptToInstall];
}

export const useIsMobileLandscape = () => {
  const isSafari = navigator.vendor.includes("Apple");
  return useMediaQuery(
    isSafari
      ? "screen and (orientation: landscape) and (max-width: 767px)"
      : "screen and (min-device-aspect-ratio: 1/1) and (orientation: landscape) and (max-width: 767px)"
  );
};

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
export function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}

export const getRadicalsPerRow = (windowWidth: number): number => {
  return Math.trunc(windowWidth / 50);
};

export function isCJK(idsChar: string) {
  if (IDCSet.has(idsChar)) return false;
  if (StrokePlaceholderSet.has(idsChar)) return false;
  // ignore all ascii
  if (idsChar.charCodeAt(0) < 127) return false;
  if (idsChar === "？") return false;
  return true;
}

// returns numIfNotPositive if num is not positive
export function notPositive(num: number, numIfNotPositive: number) {
  if (num <= 0) {
    return numIfNotPositive;
  }
  return num;
}
