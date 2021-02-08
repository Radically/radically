// import pako from "pako";
// import protobuf from "protobufjs";
import React, { useState, useEffect } from "react";
import { JSON_FILE_NAMES } from "../constants";
// import { REVERSE_MAP_PROTOBUF_DESCRIPTOR } from "../constants";

const defaultValue = {
  baseRadicals: [],
  // setExactRadicalFreq: (unused: BaseRadicals) => {},

  readings: {},
  // setReadings: (unused: ReadingsMap) => {},

  // metadata: null as ProcessedIDSMetadata,
  // setMetadata: (unused: ProcessedIDSMetadata) => {},

  loading: false,
} as {
  baseRadicals: BaseRadicals;
  readings: ReadingsMap;
  metadata?: ProcessedIDSMetadata;
  loading: boolean;
};

export const DataContext = React.createContext(defaultValue);

// const root = protobuf.Root.fromJSON(REVERSE_MAP_PROTOBUF_DESCRIPTOR);
// const ReverseMap = root.lookupType("ReverseMap");

export const DataContextProvider = (props: { children: any }) => {
  const [baseRadicals, setExactRadicalFreq] = useState([] as BaseRadicals);

  const [metadata, setMetadata] = useState({} as ProcessedIDSMetadata);

  const [readings, setReadings] = useState({} as ReadingsMap);

  const [loading, setLoading] = useState(false);

  const context = {
    baseRadicals,
    metadata,
    readings,
    // setExactRadicalFreq,
    // setMetadata,
    // setReadings,
    loading,
  };

  async function fetchData() {
    
  }

  useEffect(() => {
    fetchData();
  }, []);

  return <DataContext.Provider value={context} {...props} />;
};
