import { useRef, useState, useEffect } from "react";
import { IDCSet, StrokePlaceholderSet } from "./constants";
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
  return Math.trunc(windowWidth / 40);
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
