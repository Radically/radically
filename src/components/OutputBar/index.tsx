import styled, { StyledComponent } from "styled-components";
import React, { useEffect, useRef, useImperativeHandle, useState } from "react";

export const heightPx = 30;

const OutputBarContainer = styled.div`
  position: sticky;
  width: 100vw;
  left: 0px;
  height: ${heightPx}px;
  background-color: red;
`;

function OutputBar() {
  return <OutputBarContainer id="output-bar">blah</OutputBarContainer>;
}

export default OutputBar;
