import React, { useState } from "react";
import styled from "styled-components";
import SimpleBar from "simplebar-react";

// the result block, max width should be the width of individual radical * number of radicals in a row
const Container = styled.div`
  display: flex;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  align-items: center;
  margin-bottom: 10px;
`;

const CharacterResult = React.memo(
  (props: { char: string; readings: Readings }) => {
    const { char, readings } = props;
    return (
      <Container>
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

        <SimpleBar style={{ flex: 1, paddingTop: "5px", height: "100px" }}>
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
        </SimpleBar>
      </Container>
    );
  }
);

export default CharacterResult;
