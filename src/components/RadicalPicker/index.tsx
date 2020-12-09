import React from "react";
import { FixedSizeList as List } from "react-window";
import { Icon, Input } from "semantic-ui-react";
import styled from "styled-components";

{
  /* <List>
        {({ index, style }) =>
            <div style={style}>Item {index}</div>
        }
    </List> */
}

const RadicalPickerRow = (props: any) => {};

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

const StrokesScrollContainer = styled.div`
  border-radius: 5px;
  width: 50px;
  overflow: scroll;
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
  const arrayified = [];
  for (let strokeCount in strokeCountToRadicals) {
    arrayified.push({
      header: true,
      name: `${strokeCount === "999" ? "" : strokeCount}筆畫${
        strokeCount === "999" ? "不詳" : ""
      }`,
    });
    arrayified.push({
      header: false,
      radicals: strokeCountToRadicals[strokeCount],
    });
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
      </TwoPaneContainer>
    </RadicalPickerContainer>
  );
};

export default RadicalPicker;
