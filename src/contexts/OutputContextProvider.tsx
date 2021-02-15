import React from "react";
import { useState } from "react";

const defaultValue = {
  output: "",
  setOutput: (unused: string) => {},
};

export const OutputContext = React.createContext(defaultValue);

export const OutputContextProvider = (props: { children: any }) => {
  const [output, setOutput] = useState("");
  const context = {
    output,
    setOutput,
  };
  return <OutputContext.Provider value={context} {...props} />;
};

export default OutputContextProvider;
