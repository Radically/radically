import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { DataContext } from "../../contexts/DataContextProvider";
import { getStringForCharacterVariants } from "../RadicalsPage/utils";
// import SimpleBar from "simplebar-react";

// the result block, max width should be the width of individual radical * number of radicals in a row
const Container = styled.div`
  //   min-height: 300px;
  display: flex;
  //   box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  // border-radius: 5px;
  //   align-items: center;

  // bottom navbar + 10px padding
  @supports not (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      margin-bottom: calc(56px + 10px);
    }
  }

  @supports (-webkit-touch-callout: none) {
    margin-bottom: 10px;
  }

  @media (orientation: landscape) {
    margin-bottom: 10px;
  }

  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;

const VariantsStringContainer = styled.div`
  padding-bottom: 10px;
  font-weight: bold;
`;

const CharacterResultReadings = React.memo(
  (props: { char: string; readings: Readings }) => {
    const { char, readings } = props;
    const intl = useIntl();
    const { variantsLocales } = useContext(DataContext);

    const variantsString = getStringForCharacterVariants(
      variantsLocales[char]?.v,
      intl
    );
    return (
      <Container>
        <div
          style={{
            position: "relative",
            fontSize: "45pt",
            lineHeight: 1,
            paddingRight: "10px",
          }}
        >
          <div style={{ position: "sticky", top: "10px", textAlign: "center" }}>
            {char}
          </div>
        </div>

        {/* <SimpleBar style={{ flex: 1, paddingTop: "5px", height: "100px" }}> */}
        {/* <div> */}
        <div style={{ fontSize: "0.9rem" }}>
          {variantsString && (
            <VariantsStringContainer>{variantsString}</VariantsStringContainer>
          )}
          {char in readings
            ? Object.entries(readings[char]).map((entry) => (
                <div>
                  <span style={{ fontWeight: "bold" }}>{entry[0]}:</span>{" "}
                  {entry[1]}
                </div>
              ))
            : intl.formatMessage({
                id: "no_info",
              })}
        </div>
        {/* </div> */}
        {/* </SimpleBar> */}
      </Container>
    );
  }
);

export default CharacterResultReadings;
