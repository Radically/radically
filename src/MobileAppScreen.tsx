import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import FirstPage from "./components/FirstPage";

const MobileAppScreenContainer = styled.div`
  @media (min-width: 768px) {
    display: none;
  }

  display: flex;
  flex-direction: column;
  height: 100%;
`;

const HorizontalSnapContainer = styled.div`
  flex: 1;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
`;

function MobileAppScreen() {
  return (
    <MobileAppScreenContainer>
      {/* <div style={{ height: "100vh", backgroundColor: "red" }}>mobile</div> */}
      <HorizontalSnapContainer>
        <div
          style={{
            scrollSnapAlign: "start",
            minWidth: "100vw",
          }}
        >
          <FirstPage />
        </div>

        <div
          style={{
            scrollSnapAlign: "start",
            backgroundColor: "pink",
            height: "30px",
            minWidth: "50vw",
          }}
        ></div>

        <div
          style={{
            scrollSnapAlign: "start",
            backgroundColor: "yellow",
            height: "30px",
            minWidth: "50vw",
          }}
        ></div>
      </HorizontalSnapContainer>
      <div
        style={{
          width: "100%",
          height: "30px",
          backgroundColor: "red",
        }}
      ></div>
    </MobileAppScreenContainer>
  );
}

export default MobileAppScreen;
