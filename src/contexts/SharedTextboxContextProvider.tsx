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

  idcs: "",
  setIDCs: (unused: string) => {},

  componentsSearchResults: {} as { [key: string]: string[] } | null,
  setComponentsSearchResults: (
    unused: { [key: string]: string[] } | null
  ) => {},

  // state saved for the components route
  componentsSelectedInfo: {} as SelectedInfo,
  setComponentsSelectedInfo: (unused: SelectedInfo) => {},

  // state saved for the results route
  resultsSelectedInfo: {} as SelectedInfo,
  setResultsSelectedInfo: (unused: SelectedInfo) => {},
};

export const SharedTextboxContext = React.createContext(defaultValue);

export const SharedTextboxContextProvider = (props: { children: any }) => {
  const [output, setOutput] = useState("");
  const [relatedComponentsInput, setRelatedComponentsInput] = useState("");
  const [componentsInput, setComponentsInput] = useState("");
  const [idcs, setIDCs] = useState("");

  // state saved for the components route
  const [componentsSearchResults, setComponentsSearchResults] = useState(
    null as { [key: string]: string[] } | null
  );

  const [componentsSelectedInfo, setComponentsSelectedInfo] = useState(
    {} as SelectedInfo
  );

  // state saved for the results route
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
    idcs,
    setIDCs,

    // state to be saved for the components route
    componentsSearchResults,
    setComponentsSearchResults,

    componentsSelectedInfo,
    setComponentsSelectedInfo,

    resultsSelectedInfo,
    setResultsSelectedInfo,
  };
  return <SharedTextboxContext.Provider value={context} {...props} />;
};

export default SharedTextboxContextProvider;
