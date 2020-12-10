import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Input,
  Button,
  Dimmer,
  Loader,
  Checkbox,
  Segment,
} from "semantic-ui-react";
import styled from "styled-components";
import moment from "moment";

import logo from "./logo.svg";
import "./App.css";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";
import { SettingsContext } from "./contexts/SettingsContextProvider";
import RadicalPicker from "./components/RadicalPicker";

const IDS_URL = "/ids.txt";
const UNICODE_IRG_URL = "/Unihan_IRGSources.txt";
const UNICODE_VARIANTS_URL = "/Unihan_Variants.txt";
const UNICODE_READINGS_URL = "/Unihan_Readings.txt";

const AppNameh1 = styled.h1`
  font-size: 3rem;
  font-family: Hanamin;
  color: grey;
  font-weight: bold;
`;

const AppContainer = styled.div`
  // display: flex;
  // align-items: center;
  // justify-content: center;
  height: 100%;
`;

const SearchAndRadicalContainer = styled.div`
  width: 100%;
  display: flex;
`;

const SearchArea = styled.div`
  flex: 0.7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RadicalPickerArea = styled.div`
  flex: 0.3;
`;

const SearchFieldInput = styled(Input)`
  width: 100%;
  padding: 5px;
`;

const Caption = styled.p`
  font-size: 8.5pt;
`;

const loadIDSWorker: Worker = new Worker("./workers/loadIDS.js");
const queryIDSWorker: Worker = new Worker("./workers/queryIDS.js");

/* const state = {
  forwardMapUint8: new Float64Array(),
  reverseMapUint8: new Float64Array(),
}; */

function App() {
  const [loadingText, setLoadingText] = useState("");
  // const [compatible, setCompatible] = useState(true);
  const [radicals, setRadicals] = useState("");
  const [idcs, setIDCs] = useState("");

  const [metadata, setMetadata] = useState({
    entries: 0,
    unique_radicals: 0,
    date: null,
  });

  const [queryResults, setQueryResults] = useState({
    res: null,
    charToMap: null,
  });
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setState((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const [strokeCount, setStrokeCount] = useState({});
  const [baseRadicals, setBaseRadicals] = useState([] as string[]);
  const [readings, setReadings] = useState({});

  // const baseRadicals: React.MutableRefObject<BaseRadicals> = useRef(new Set());
  const forwardMap = useRef({});
  const reverseMap = useRef({});
  // const strokeCount: React.MutableRefObject<StrokeCount> = useRef({});
  const variantRadicals = useRef({});
  // const forwardMapUint8 = useRef(new Float64Array());
  // const reverseMapUint8 = useRef(new Float64Array());

  loadIDSWorker.onmessage = (event) => {
    if (event && event.type) {
      const { msg } = event.data;
      if (msg === "done") {
        const {
          baseRadicals: _baseRadicals,
          forwardMap: _forwardMap,
          reverseMap: _reverseMap,
          strokeCount: _strokeCount,
          variantRadicals: _variantRadicals,
          readings: _readings,
          // forwardMapUint8: _forwardMapUint8,
          // reverseMapUint8: _reverseMapUint8,
          metadata,
        } = event.data;
        console.log(metadata);
        // console.log(_reverseMap["臉"]);
        // console.log(_reverseMap["䡛"]);
        // console.log(_reverseMap["鬱"]);
        // console.log(_reverseMap["陳"]);
        // console.log(_reverseMap["𥄳"]);

        // console.log(_forwardMapUint8);

        // baseRadicals.current = _baseRadicals;
        forwardMap.current = _forwardMap;
        reverseMap.current = _reverseMap;
        // strokeCount.current = _strokeCount;
        variantRadicals.current = _variantRadicals;
        // forwardMapUint8.current = _forwardMapUint8;
        // reverseMapUint8.current = _reverseMapUint8;
        // setMetadata(metadata);

        setStrokeCount(_strokeCount);
        setBaseRadicals(_baseRadicals);
        setReadings(_readings);
        setLoadingText("");
      }
    }
  };

  queryIDSWorker.onmessage = (event) => {
    if (event && event.type) {
      const { msg } = event.data;
      if (msg === "done") {
        const {
          // forwardMapUint8: _forwardMapUint8,
          // reverseMapUint8: _reverseMapUint8,
          msg,
          ...rest
        } = event.data;
        // forwardMapUint8.current = _forwardMapUint8;
        // reverseMapUint8.current = _reverseMapUint8;
        setQueryResults(rest);
        console.log(rest);
        setLoadingText("");
      }
    }
  };

  useEffect(() => {
    setLoadingText("Loading IDS File");
    loadIDSWorker.postMessage({
      msg: "load",
      ids_url: IDS_URL,
      unicode_irg_url: UNICODE_IRG_URL,
      unicode_variants_url: UNICODE_VARIANTS_URL,
      unicode_readings_url: UNICODE_READINGS_URL,
    });
  }, []);

  return (
    <SettingsContextProvider>
      <SettingsContext.Consumer>
        {({
          exactRadicalFreq,
          setExactRadicalFreq,
        }: {
          exactRadicalFreq: boolean;
          setExactRadicalFreq: (arg0: boolean) => void;
        }) => (
          <Container style={{ paddingTop: "calc(.3 * 100vh)", height: "100%" }}>
            <AppContainer>
              <SearchAndRadicalContainer>
                <SearchArea>
                  <AppNameh1>部首組合式漢字檢索</AppNameh1>

                  <Segment>
                    <Dimmer active={!!loadingText}>
                      <Loader>{loadingText}</Loader>
                    </Dimmer>
                    <div style={{ maxWidth: "1000px" }}>
                      <div style={{ display: "flex" }}>
                        <Input
                          style={{
                            width: "100%",
                            padding: "5px",
                            display: "inline-block",
                          }}
                          label="Radicals"
                          placeholder="食喜"
                          onChange={(evt) => {
                            setRadicals(evt.target.value);
                          }}
                          value={radicals}
                        />
                        <div style={{ width: "110px", textAlign: "center" }}>
                          <Checkbox
                            toggle
                            checked={exactRadicalFreq}
                            onChange={() => {
                              setExactRadicalFreq(!exactRadicalFreq);
                            }}
                          />
                          <Caption>部首率完全一致*</Caption>
                        </div>
                      </div>

                      <Input
                        style={{ width: "100%", padding: "5px" }}
                        label="IDCs"
                        placeholder="⿺⿱"
                        onChange={(evt) => {
                          setIDCs(evt.target.value);
                        }}
                        value={idcs}
                      />
                    </div>

                    <div style={{ padding: "5px" }}>
                      <Button
                        disabled={!!!radicals}
                        style={{ display: "block" }}
                        primary
                        onClick={() => {
                          setLoadingText("Querying...");
                          queryIDSWorker.postMessage(
                            {
                              msg: "query",
                              forwardMap: forwardMap.current,
                              reverseMap: reverseMap.current,
                              // forwardMapUint8: forwardMapUint8.current,
                              // reverseMapUint8: reverseMapUint8.current,
                              radicals,
                              idcs,
                              exactRadicalFreq,
                            }
                            // [forwardMapUint8.current, reverseMapUint8.current]
                          );
                        }}
                      >
                        Search
                      </Button>
                    </div>
                  </Segment>

                  <div style={{ width: "100%", padding: "5px" }}>
                    <p>Entries: {metadata.entries}</p>
                    <p>Unique Radicals: {metadata.unique_radicals}</p>
                    <p>
                      IDS Last Modified:{" "}
                      {metadata.date
                        ? moment(metadata.date).format("lll")
                        : "Never"}
                    </p>
                  </div>
                </SearchArea>
                <RadicalPickerArea>
                  <RadicalPicker
                    baseRadicals={baseRadicals}
                    strokeCount={strokeCount}
                    readings={readings}
                  />
                </RadicalPickerArea>
              </SearchAndRadicalContainer>
            </AppContainer>
          </Container>
        )}
      </SettingsContext.Consumer>
    </SettingsContextProvider>
  );
}

export default App;
