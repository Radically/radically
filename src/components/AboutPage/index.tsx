import { useContext, useEffect, useRef, useState } from "react";

import { useIntl } from "react-intl";
import styled from "styled-components";
import { heightPx } from "../OutputBar";
import { SettingsContext } from "../../contexts/SettingsContextProvider";

const AboutPageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // height: 100%;
  // position: relative;

  scroll-snap-align: start;
  min-width: 100vw;

  // for mobile safari
  // 56px is the height of the MUI bottom navbar
  @supports (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      margin-bottom: calc(56px + ${heightPx}px);
    }
  }
`;


function AboutPage(props: { containerRef?: React.Ref<HTMLDivElement> }) {
  const { containerRef } = props;
  const intl = useIntl();
  const { darkMode } = useContext(SettingsContext);

  return (
    <AboutPageContainer ref={containerRef} id="about-page-container">

    </AboutPageContainer>
  )
}

export default AboutPage