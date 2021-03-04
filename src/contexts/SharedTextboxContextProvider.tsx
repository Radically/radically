import React from "react";
import { useState } from "react";
import { SelectedInfo } from "../types/common";

const defaultValue = {
  output: "",
  setOutput: (unused: string) => {},

  relatedComponentsInput: "",
  setRelatedComponentsInput: (unused: string) => {},

  componentsInput: "",
  setComponentsInput: (unused: string) => {},

  componentsSearchResults: {} as { [key: string]: string[] } | null,
  setComponentsSearchResults: (
    unused: { [key: string]: string[] } | null
  ) => {},

  // state saved for the components route
  componentsScrollPosition: 0,
  setComponentsScrollPosition: (position: number) => {},

  componentsSelectedInfo: {} as SelectedInfo,
  setComponentsSelectedInfo: (unused: SelectedInfo) => {},

  // state saved for the results route
  resultsSelectedInfo: {} as SelectedInfo,
  setResultsSelectedInfo: (unused: SelectedInfo) => {},

  resultsScrollPosition: 0,
  setResultsScrollPosition: (unused: number) => {},
};

export const SharedTextboxContext = React.createContext(defaultValue);

export const SharedTextboxContextProvider = (props: { children: any }) => {
  const [output, setOutput] = useState("");
  const [relatedComponentsInput, setRelatedComponentsInput] = useState("");
  const [componentsInput, setComponentsInput] = useState("");

  // state saved for the components route
  const [componentsSearchResults, setComponentsSearchResults] = useState(
    null as { [key: string]: string[] } | null
  );

  const [componentsScrollPosition, setComponentsScrollPosition] = useState(0);

  const [componentsSelectedInfo, setComponentsSelectedInfo] = useState(
    {} as SelectedInfo
  );

  // state saved for the results route
  const [resultsScrollPosition, setResultsScrollPosition] = useState(0);

  const [resultsSelectedInfo, setResultsSelectedInfo] = useState(
    {} as SelectedInfo
  );

  const context = {
    output,
    setOutput,
    relatedComponentsInput,
    setRelatedComponentsInput,
    componentsInput,
    setComponentsInput,

    // state to be saved for the components route
    componentsSearchResults,
    setComponentsSearchResults,

    componentsScrollPosition,
    setComponentsScrollPosition,

    componentsSelectedInfo,
    setComponentsSelectedInfo,

    resultsScrollPosition,
    setResultsScrollPosition,

    resultsSelectedInfo,
    setResultsSelectedInfo,
  };
  return <SharedTextboxContext.Provider value={context} {...props} />;
};

export default SharedTextboxContextProvider;
