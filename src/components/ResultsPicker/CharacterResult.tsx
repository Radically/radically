import React, { useState } from "react";
import styled from "styled-components";
import SimpleBar from "simplebar-react";

import { INDIVIDUAL_RADICAL_WIDTH_PX, RADICALS_PER_ROW } from "./Constants";

// the result block, max width should be the width of individual radical * number of radicals in a row
const Container = styled(SimpleBar)`
  //   width: ${INDIVIDUAL_RADICAL_WIDTH_PX * RADICALS_PER_ROW};
  height: 100px;
`;

const CharacterResult = React.memo(
  (props: { char: string; readings: Readings }) => {
    const { char, readings } = props;
    return (
      <div
        style={{
          display: "flex",
          borderColor: "red",
          borderWidth: "2px",
          borderRadius: "5px",
          boxShadow: "inset 0 0 10px rgba(0,0,0,.5)",

          // justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "45pt",
            lineHeight: 1,
            paddingRight: "5px",
            paddingTop: "5px",
            paddingLeft: "10px",
          }}
        >
          {char}
        </div>

        <Container style={{ flex: 1, paddingTop: "5px" }}>
          {/* <div> */}
          {char in readings
            ? Object.entries(readings[char]).map((entry) => (
                <div>
                  <span style={{ fontWeight: "bold" }}>{entry[0]}:</span>{" "}
                  {entry[1]}
                </div>
              ))
            : "No info available."}
          {/* </div> */}
        </Container>
      </div>
    );
  }
);

export default CharacterResult;
