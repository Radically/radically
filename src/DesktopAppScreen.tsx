import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const DesktopAppScreenContainer = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

function DesktopAppScreen() {
  return <DesktopAppScreenContainer>desktop</DesktopAppScreenContainer>;
}

export default DesktopAppScreen;
