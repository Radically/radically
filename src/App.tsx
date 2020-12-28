import React, { useEffect, useRef, useState } from "react";
import useClippy from "use-clippy";
import {
  Container,
  Input,
  Button,
  Icon,
  Label,
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
import ResultsPicker from "./components/ResultsPicker";
import IDSPicker from "./components/IDSPicker";

const IDS_URL = "/ids.txt";
const UNICODE_IRG_URL = "/Unihan_IRGSources.txt";
const UNICODE_VARIANTS_URL = "/Unihan_Variants.txt";
const UNICODE_READINGS_URL = "/Unihan_Readings.txt";

const AppNameh1 = styled.h1`
  font-size: 3rem;
  @media (max-width: 479px) {
    font-size: 2rem;
  }
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

  @media (max-width: 991px) {
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 992px) {
    flex-direction: row;
  }
`;

const SearchArea = styled.div`
  flex: 0.7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 991px) {
    // width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
`;

const RadicalPickerArea = styled.div`
  @media (min-width: 992px) {
    flex: 0.3;
  }

  @media (max-width: 991px) {
    width: 100%;
  }

  max-width: 400px;
  padding-right: 15px;
  padding-left: 15px;
`;

const ResultsPickerArea = styled.div`
  @media (max-width: 991px) {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchFieldInput = styled(Input)`
  width: 100%;
  padding: 5px;
`;

const Caption = styled.p`
  font-weight: bold;
  font-size: 8.5pt;
`;

const OutputContainer = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  @media (max-width: 991px) {
    display: none;
  }

  @media (min-width: 992px) {
    display: flex;
  }
`;

const DesktopExactCheckboxContainer = styled.div`
  @media (max-width: 991px) {
    display: none;
  }
  width: 110px;
  text-align: center;
`;

const MobileExactCheckboxContainer = styled.div`
  @media (min-width: 992px) {
    display: none;
  }
  // width: 110px;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;
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

  const [output, setOutput] = useState("");

  const [metadata, setMetadata] = useState({
    entries: 0,
    unique_radicals: 0,
    date: null,
  });

  const [queryResults, setQueryResults] = useState({
    res: null,
    charToSet: null,
  });

  const [showCopied, setShowCopied] = useState(false);

  const clearQueryResults = () => {
    setQueryResults({ res: null, charToSet: null });
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setState((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const [reverseMap, setReverseMap] = useState({});
  const [strokeCount, setStrokeCount] = useState({});
  const [baseRadicals, setBaseRadicals] = useState([] as string[]);
  const [variantRadicals, setVariantRadicals] = useState({});
  const [readings, setReadings] = useState({});

  // const baseRadicals: React.MutableRefObject<BaseRadicals> = useRef(new Set());
  const forwardMap = useRef({});
  // const reverseMap = useRef({});
  // const strokeCount: React.MutableRefObject<StrokeCount> = useRef({});
  // const variantRadicals = useRef({});
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
        // reverseMap.current = _reverseMap;
        // strokeCount.current = _strokeCount;
        // variantRadicals.current = _variantRadicals;
        // forwardMapUint8.current = _forwardMapUint8;
        // reverseMapUint8.current = _reverseMapUint8;
        // setMetadata(metadata);

        setReverseMap(_reverseMap);
        setStrokeCount(_strokeCount);
        setBaseRadicals(_baseRadicals);
        setVariantRadicals(_variantRadicals);
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

  const handleRadicalSelected = (radical: string) => {
    // console.log(radical);
    setRadicals(radicals + radical);
  };

  const handleResultSelected = (result: string) => {
    setOutput(output + result);
  };

  const [clipboard, setClipboard] = useClippy();

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
          <div
            style={{
              marginTop: "calc(.3 * 100vh)",
              height: "100%",
              maxWidth: "1127px",
              // horizontally center
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <AppContainer>
              <SearchAndRadicalContainer>
                <SearchArea>
                  <AppNameh1>部首組合式漢字檢索</AppNameh1>

                  <Segment>
                    <Dimmer active={!!loadingText}>
                      <Loader>{loadingText}</Loader>
                    </Dimmer>
                    <div style={{ maxWidth: "1000px" }}>
                      <div style={{ display: "flex", width: "100%" }}>
                        <Input
                          fluid
                          style={{
                            // width: "320px",
                            // to handle chromium... 
                            width: "99%",
                            padding: "5px",
                            // display: "inline-block",
                          }}
                          // label="Radicals"
                          labelPosition="left"
                          placeholder="食喜"
                          onChange={(evt) => {
                            setRadicals(evt.target.value);
                          }}
                          value={radicals}
                          action={!!radicals}
                        >
                          <Label>Radicals</Label>
                          <input />
                          {!!radicals && (
                            <Button
                              onClick={() => {
                                setRadicals("");
                              }}
                              icon
                              color="grey"
                            >
                              <Icon name="close" />
                            </Button>
                          )}
                        </Input>

                        <DesktopExactCheckboxContainer>
                          <Checkbox
                            toggle
                            checked={exactRadicalFreq}
                            onChange={() => {
                              setExactRadicalFreq(!exactRadicalFreq);
                            }}
                          />
                          <Caption>部首率完全一致*</Caption>
                        </DesktopExactCheckboxContainer>
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

                      <IDSPicker onIDSSelected={(idc) => setIDCs(idcs + idc)} />
                    </div>

                    <div
                      style={{
                        padding: "5px",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <MobileExactCheckboxContainer>
                        <Checkbox
                          toggle
                          checked={exactRadicalFreq}
                          onChange={() => {
                            setExactRadicalFreq(!exactRadicalFreq);
                          }}
                        />
                        <Caption>部首率完全一致*</Caption>
                      </MobileExactCheckboxContainer>

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
                              reverseMap: reverseMap,
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

                  <OutputContainer>
                    <Input
                      style={{ width: "75%", padding: "15px" }}
                      // label={{ content: "Output", color: "blue" }}
                      labelPosition="left"
                      placeholder=""
                      value={output}
                      onChange={(evt) => {
                        setOutput(evt.target.value);
                      }}
                      action
                    >
                      <Label color="blue">Output</Label>
                      <input />

                      {output && (
                        <Button
                          onClick={() => {
                            setOutput("");
                          }}
                          icon
                          color="grey"
                        >
                          <Icon name="close" />
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setClipboard(output);
                          setShowCopied(true);
                          setTimeout(() => {
                            setShowCopied(false);
                          }, 1000);
                        }}
                        icon
                        color="blue"
                      >
                        <Icon name="copy" />
                      </Button>
                    </Input>

                    <div style={{ height: "1.5rem", color: "grey" }}>
                      {showCopied ? "Copied to clipboard" : ""}
                    </div>
                  </OutputContainer>

                  <ResultsPickerArea>
                    <ResultsPicker
                      onResultSelected={handleResultSelected}
                      queryResults={queryResults}
                      readings={readings}
                    />
                  </ResultsPickerArea>

                  <div style={{ width: "100%", padding: "5px" }}>
                    <div>Entries: {metadata.entries}</div>
                    <div>Unique Radicals: {metadata.unique_radicals}</div>
                    <div>
                      IDS Last Modified:{" "}
                      {metadata.date
                        ? moment(metadata.date).format("lll")
                        : "Never"}
                    </div>
                  </div>
                </SearchArea>
                <RadicalPickerArea>
                  <RadicalPicker
                    onRadicalSelected={handleRadicalSelected}
                    baseRadicals={baseRadicals}
                    variantRadicals={variantRadicals}
                    reverseMap={reverseMap}
                    strokeCount={strokeCount}
                    readings={readings}
                  />
                </RadicalPickerArea>
              </SearchAndRadicalContainer>
            </AppContainer>
          </div>
        )}
      </SettingsContext.Consumer>
    </SettingsContextProvider>
  );
}

export default App;
