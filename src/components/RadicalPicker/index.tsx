import React, { useState, useRef } from "react";
import {
  FixedSizeList,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Input } from "semantic-ui-react";
import styled from "styled-components";
import SimpleBar from "simplebar-react";
import { IDCSet } from "../../constants";

const RADICALS_PER_ROW = 8; // arbitrary

const ReadingsSection = styled(SimpleBar)`
  background-color: lightgray;
  margin-top: 5px;
  border-radius: 5px;
  padding: 5px;
  max-height: 100px;
`;

const HeaderRow = styled.div`
  font-size: 12pt;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  align-items: center;
`;

const NormalRow = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IndividualRadicalCell = styled("div")<{ selected: boolean }>`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "white" : "none")};
  border-radius: 5px;
  cursor: pointer;
`;

const RadicalPickerRow = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { arrayified, handleRadicalClick, selectedInfo } = data;
  if (arrayified[index].header) {
    return <HeaderRow style={style}>{arrayified[index].name}</HeaderRow>;
  }
  return (
    <NormalRow
      key={index}
      style={{
        ...style,
      }}
    >
      {arrayified[index].radicals.map((radical: string, col: number) => (
        <IndividualRadicalCell
          selected={selectedInfo.index === index && selectedInfo.col === col}
          onClick={() => {
            handleRadicalClick(index, col, radical);
          }}
        >
          {radical}
        </IndividualRadicalCell>
      ))}

      {new Array(RADICALS_PER_ROW - arrayified[index].radicals.length)
        .fill(undefined)
        .map((x) => (
          <IndividualRadicalCell selected={false} />
        ))}
    </NormalRow>
  );
};

const NarrowedRadicalPickerRow = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { narrowedArrayified, selectedInfo, handleRadicalClick } = data;
  return (
    <NormalRow key={index} style={style}>
      {narrowedArrayified[index].map((radical: string, col: number) => (
        <IndividualRadicalCell
          selected={selectedInfo.index === index && selectedInfo.col === col}
          onClick={() => {
            handleRadicalClick(index, col, radical);
          }}
        >
          {radical}
        </IndividualRadicalCell>
      ))}
    </NormalRow>
  );
};

const RadicalPickerContainer = styled.div`
  background-color: grey;
  padding: 5px;
  border-radius: 5px;
  // max-height: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const TwoPaneContainer = styled.div`
  padding-top: 5px;
  flex: 1;
  display: flex;
  min-height: 0;
`;

const StrokesScrollContainer = styled(SimpleBar)`
  border-radius: 5px;
  width: 50px;
  // overflow: scroll;
  // background-color: red;
  background-color: lightgray;
`;

const NarrowedRadicalsContainer = styled.div`
  margin-top: 5px;
  background-color: lightgray;
  border-radius: 5px;
  flex: 1;
  min-height: 0;
  font-size: 15pt;
  font-weight: bold;
`;

interface RadicalPickerProps {
  reverseMap: ReverseMap;
  variantRadicals: VariantRadicals;
  baseRadicals: BaseRadicals;
  strokeCount: StrokeCount;
  readings: Readings;
  onRadicalSelected: (radical: string) => void;
}

interface SelectedInfo {
  index: number;
  col: number;
  radical: string;
}

const RadicalPicker = (props: RadicalPickerProps) => {
  const {
    baseRadicals,
    variantRadicals,
    strokeCount,
    readings,
    reverseMap,
    onRadicalSelected,
  } = props;

  const [selectedInfo, setSelectedInfo] = useState({} as SelectedInfo);

  const [narrowedRadicals, setNarrowedRadicals] = useState([] as string[]);

  const searchText = useRef<string>("");
  const radicalListRef = useRef<FixedSizeList>(null);
  const narrowedRadicalListRef = useRef<FixedSizeList>(null);
  const strokeCountToRadicals: { [key: number]: string[] } = { 999: [] };
  // for (let radical of baseRadicals) {
  for (let radical of Object.keys(variantRadicals)) {
    const strokes = strokeCount[radical] || 999;
    if (!strokeCountToRadicals[strokes]) strokeCountToRadicals[strokes] = [];
    strokeCountToRadicals[strokes].push(radical);
  }

  const strokeCountToStart: { [key: string]: number } = {};

  const arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[] = [];
  for (let strokeCount in strokeCountToRadicals) {
    strokeCountToStart[strokeCount] = arrayified.length;
    arrayified.push({
      header: true,
      name: `${strokeCount === "999" ? "" : strokeCount}筆畫${
        strokeCount === "999" ? "不詳" : ""
      }`,
    });

    let tempArray;
    for (
      let i = 0, j = strokeCountToRadicals[strokeCount].length;
      i < j;
      i += RADICALS_PER_ROW
    ) {
      tempArray = strokeCountToRadicals[strokeCount].slice(
        i,
        i + RADICALS_PER_ROW
      );
      arrayified.push({
        header: false,
        radicals: tempArray,
      });
    }
  }

  const narrowedArrayified: string[][] = [];
  let tempArray;
  for (let i = 0, j = narrowedRadicals.length; i < j; i += RADICALS_PER_ROW) {
    tempArray = narrowedRadicals.slice(i, i + RADICALS_PER_ROW);
    narrowedArrayified.push(tempArray);
  }

  const handleRadicalClick = (index: number, col: number, radical: string) => {
    if (selectedInfo.index === index && selectedInfo.col === col)
      onRadicalSelected(radical);
    setSelectedInfo({ index, col, radical });
  };

  // get the 1st level decomposition of each individual character + all related radicals, add them all into a set
  const handleSearchClick = (e: Event, data: any) => {
    const relatedRadicals = new Set<string>();
    if (searchText.current) {
      for (let char of searchText.current) {
        relatedRadicals.add(char);
        // add the 1st level decomp
        if (reverseMap[char])
          for (let { ids } of reverseMap[char].ids_strings) {
            for (let radical of ids) {
              if (!IDCSet.has(radical)) relatedRadicals.add(radical);
            }
          }

        if (variantRadicals[char])
          for (let radical of Array.from(variantRadicals[char]))
            relatedRadicals.add(radical);
      }
    }
    // add all variants of the result for convenience, e.g. 见 -> 見
    for (let char of Array.from(relatedRadicals)) {
      if (variantRadicals[char])
        for (let radical of Array.from(variantRadicals[char]))
          relatedRadicals.add(radical);
    }
    setNarrowedRadicals(Array.from(relatedRadicals));
  };

  const radicalSelected = "index" in selectedInfo && "col" in selectedInfo;
  return (
    <RadicalPickerContainer>
      <Input
        onChange={(e) => {
          searchText.current = e.target.value;
          if (searchText.current === "") setNarrowedRadicals([]);
        }}
        action={{
          icon: "search",
          onClick: handleSearchClick,
        }}
        placeholder="Search..."
      />

      {narrowedRadicals.length > 0 && (
        <NarrowedRadicalsContainer>
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={narrowedRadicalListRef}
                height={height}
                itemData={{
                  narrowedArrayified,
                  selectedInfo,
                  handleRadicalClick,
                }}
                itemCount={narrowedArrayified.length}
                itemSize={35}
                width={width}
              >
                {NarrowedRadicalPickerRow}
              </List>
            )}
          </AutoSizer>
        </NarrowedRadicalsContainer>
      )}

      {narrowedRadicals.length === 0 && (
        <TwoPaneContainer>
          <StrokesScrollContainer>
            {Object.keys(strokeCountToRadicals).map((strokeCount) => (
              <div
                onClick={() => {
                  (radicalListRef as any).current.scrollToItem(
                    strokeCountToStart[strokeCount],
                    "center"
                  );
                }}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
              >
                {strokeCount === "999" ? "不詳" : strokeCount}
              </div>
            ))}
          </StrokesScrollContainer>

          <div
            style={{
              // fontFamily: "Hanamin",
              fontWeight: "bold",
              fontSize: "15pt",
              backgroundColor: "lightgray",
              flex: 1,
              marginLeft: "5px",
              borderRadius: "5px",
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={radicalListRef}
                  height={height}
                  itemData={{ arrayified, selectedInfo, handleRadicalClick }}
                  itemCount={arrayified.length}
                  itemSize={35}
                  width={width}
                >
                  {RadicalPickerRow}
                </List>
              )}
            </AutoSizer>
          </div>
        </TwoPaneContainer>
      )}

      {radicalSelected && (
        <ReadingsSection>
          {selectedInfo.radical in readings
            ? Object.entries(readings[selectedInfo.radical]).map((entry) => (
                <div>
                  <span style={{ fontWeight: "bold" }}>{entry[0]}:</span>{" "}
                  {entry[1]}
                </div>
              ))
            : "No info available."}
        </ReadingsSection>
      )}
    </RadicalPickerContainer>
  );
};

export default RadicalPicker;
