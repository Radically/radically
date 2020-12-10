import React from "react";
import {
  FixedSizeList as List,
  FixedSizeListProps,
  ListChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Input } from "semantic-ui-react";
import styled from "styled-components";
import SimpleBar from "simplebar-react";

const RADICALS_PER_ROW = 8; // arbitrary

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
`;

const IndividualRadicalCell = styled.div`
  width: 25px;
  text-align: center;
`;

const RadicalPickerRow = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  if (data[index].header) {
    return <HeaderRow style={style}>{data[index].name}</HeaderRow>;
  }
  return (
    <NormalRow
      key={index}
      style={{
        ...style,
      }}
    >
      {data[index].radicals.map((radical: string) => (
        <IndividualRadicalCell>{radical}</IndividualRadicalCell>
      ))}

      {new Array(RADICALS_PER_ROW - data[index].radicals.length)
        .fill(undefined)
        .map((x) => (
          <IndividualRadicalCell />
        ))}
    </NormalRow>
  );
};

const RadicalPickerContainer = styled.div`
  background-color: grey;
  padding: 5px;
  border-radius: 5px;
  // max-height: 300px;
  height: 300px;
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
  background-color: darkgrey;
`;

interface RadicalPickerProps {
  baseRadicals: BaseRadicals;
  strokeCount: StrokeCount;
}

const RadicalPicker = (props: RadicalPickerProps) => {
  const { baseRadicals, strokeCount } = props;

  const strokeCountToRadicals: { [key: number]: string[] } = { 999: [] };
  for (let radical of baseRadicals) {
    const strokes = strokeCount[radical] || 999;
    if (!strokeCountToRadicals[strokes]) strokeCountToRadicals[strokes] = [];
    strokeCountToRadicals[strokes].push(radical);
  }

  console.log(strokeCountToRadicals);
  const arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[] = [];
  for (let strokeCount in strokeCountToRadicals) {
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
  console.log(arrayified);

  return (
    <RadicalPickerContainer>
      <Input action={{ icon: "search" }} placeholder="Search..." />
      <TwoPaneContainer>
        <StrokesScrollContainer>
          {Object.keys(strokeCountToRadicals).map((strokeCount) => (
            <div
              style={{
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              {strokeCount === "999" ? "不詳" : strokeCount}
            </div>
          ))}
        </StrokesScrollContainer>

        <div
          style={{
            fontFamily: "Hanamin",
            fontWeight: "bold",
            fontSize: "15pt",
            backgroundColor: "darkgray",
            flex: 1,
            marginLeft: "5px",
            borderRadius: "5px",
          }}
        >
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemData={arrayified}
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
    </RadicalPickerContainer>
  );
};

export default RadicalPicker;
