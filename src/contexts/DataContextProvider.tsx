// import pako from "pako";
// import protobuf from "protobufjs";
import React, { useState, useEffect } from "react";
import { JSON_FILE_NAMES } from "../constants";
// import { REVERSE_MAP_PROTOBUF_DESCRIPTOR } from "../constants";

const defaultValue = {
  baseRadicals: [],
  // setExactRadicalFreq: (unused: BaseRadicals) => {},
  baseRadicalsLoading: false,

  readings: {},
  readingsLoading: false,
  // setReadings: (unused: ReadingsMap) => {},

  // metadata: null as ProcessedIDSMetadata,
  // setMetadata: (unused: ProcessedIDSMetadata) => {},

  strokeCount: {},
  strokeCountLoading: false,

  variantsLocales: {},
  variantsLocalesLoading: false,

  variantsIslands: { islands: [] as string[][], chars: {} },
  variantsIslandsLoading: false,

  metadataLoading: false,

  // loading: false,
} as {
  baseRadicals: BaseRadicals;
  baseRadicalsLoading: boolean;
  readings: ReadingsMap;
  readingsLoading: boolean;

  strokeCount: StrokeCount;
  strokeCountLoading: boolean;

  variantsLocales: VariantsLocalesMap;
  variantsLocalesLoading: boolean;

  variantsIslands: VariantsIslandsLookup;
  variantsIslandsLoading: boolean;

  metadata?: ProcessedIDSMetadata;
  metadataLoading: boolean;
  // loading: boolean;
};

export const DataContext = React.createContext(defaultValue);

// const root = protobuf.Root.fromJSON(REVERSE_MAP_PROTOBUF_DESCRIPTOR);
// const ReverseMap = root.lookupType("ReverseMap");

export const DataContextProvider = (props: { children: any }) => {
  const [baseRadicals, setBaseRadicals] = useState([] as BaseRadicals);

  const [metadata, setMetadata] = useState({} as ProcessedIDSMetadata);

  const [strokeCount, setStrokeCount] = useState({} as StrokeCount);
  const [readings, setReadings] = useState({} as ReadingsMap);

  const [variantsLocales, setVariantsLocales] = useState(
    {} as VariantsLocalesMap
  );

  const [variantsIslands, setVariantsIslands] = useState({
    islands: [] as string[][],
    chars: {},
  } as VariantsIslandsLookup);

  const [loading, setLoading] = useState({
    baseRadicalsLoading: false,
    metadataLoading: false,
    strokeCountLoading: false,
    readingsLoading: false,
    variantsLocalesLoading: false,
    variantsIslandsLoading: false,
    // not exposed
    triggerFetchAll: false,
  });

  const context = {
    baseRadicals,
    baseRadicalsLoading: loading.baseRadicalsLoading,

    metadata,
    metadataLoading: loading.metadataLoading,

    strokeCount,
    strokeCountLoading: loading.strokeCountLoading,
    readings,

    readingsLoading: loading.readingsLoading,

    variantsLocales,
    variantsLocalesLoading: loading.variantsLocalesLoading,

    variantsIslands,
    variantsIslandsLoading: loading.variantsIslandsLoading,
    // setExactRadicalFreq,
    // setMetadata,
    // setReadings,
    // loading,
  };

  async function fetchData() {
    // const resp = await fetch("/json/reverseMap.pako.pbuf");
    // console.log("reversemap decode start ", new Date());
    // const buffer = pako.inflateRaw(Buffer.from(await resp.arrayBuffer()));

    // console.log("reversemap pako inflate done ", new Date());

    // const message = ReverseMap.decode(buffer);

    // const obj = ReverseMap.toObject(message);

    // console.log("reversemap decode end ", new Date());

    /* {
      // 5 MB test
      const resp = await fetch(
        "json/" + JSON_FILE_NAMES.reverseMapCharFreqsOnly
      );
      console.log("parse readings start", new Date());
      const x = await resp.json();
      console.log("parse readings end", new Date());
      console.log(x);
    } */

    const {
      // not exposed
      triggerFetchAll,
    } = loading;

    if (!triggerFetchAll) return;

    setLoading((prevState) => ({ ...prevState, triggerFetchAll: false }));
    await Promise.all(
      [
        {
          setData: setBaseRadicals,
          loadingKey: "baseRadicalsLoading",
          jsonFileName: JSON_FILE_NAMES.baseRadicals,
        },
        {
          setData: setMetadata,
          loadingKey: "metadataLoading",
          jsonFileName: JSON_FILE_NAMES.processedIDSMetadata,
        },
        {
          setData: setStrokeCount,
          loadingKey: "strokeCountLoading",
          jsonFileName: JSON_FILE_NAMES.strokeCount,
        },
        {
          setData: setReadings,
          loadingKey: "readingsLoading",
          jsonFileName: JSON_FILE_NAMES.readings,
        },
        {
          setData: setVariantsLocales,
          loadingKey: "variantsLocalesLoading",
          jsonFileName: JSON_FILE_NAMES.variantsLocalesMap,
        },
        {
          setData: setVariantsIslands,
          loadingKey: "variantsIslandsLoading",
          jsonFileName: JSON_FILE_NAMES.variantsIslandsLookup,
        },
      ].map(async ({ setData, loadingKey, jsonFileName }) => {
        let data = await fetch("json/" + jsonFileName);
        setData(await data.json());
        setLoading((prevState) => ({ ...prevState, [loadingKey]: false }));
      })
    );
    // console.log(obj);
    /* console.log("reversemap fetch start ", new Date());
    const reverseMap = await fetch("/json/reverseMap.json");
    console.log("reversemap fetch end ", new Date());

    console.log("json parser rmap start", new Date());
    const reverseMapJSON = await reverseMap.json();
    console.log("json parser rmap end", new Date()); */
  }

  useEffect(() => {
    fetchData();
  }, [loading.triggerFetchAll]);

  useEffect(() => {
    setLoading({
      strokeCountLoading: true,
      baseRadicalsLoading: true,
      metadataLoading: true,
      readingsLoading: true,
      variantsLocalesLoading: true,
      variantsIslandsLoading: true,
      triggerFetchAll: true,
    });
  }, []);

  return <DataContext.Provider value={context} {...props} />;
};
