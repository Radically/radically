import React from "react";
import { useState } from "react";

const defaultValue = {
  output: "",
  setOutput: (unused: string) => { },

  relatedComponentsInput: "",
  setRelatedComponentsInput: (unused: string) => { },

  componentsInput: "",
  setComponentsInput: (unused: string) => { },
};

export const SharedTextboxContext = React.createContext(defaultValue);

export const SharedTextboxContextProvider = (props: { children: any }) => {
  const [output, setOutput] = useState("");
  const [relatedComponentsInput, setRelatedComponentsInput] = useState("");
  const [componentsInput, setComponentsInput] = useState("");


  const context = {
    output,
    setOutput,
    relatedComponentsInput, setRelatedComponentsInput,
    componentsInput, setComponentsInput
  };
  return <SharedTextboxContext.Provider value={context} {...props} />;
};

export default SharedTextboxContextProvider;
