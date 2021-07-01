import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import A2HSInstructions from "./a2hs";

import WriteUp from "./WriteUp";

const AboutPageContainer = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  padding: 15px;
`;

function AboutPage(props: {
  containerRef?: React.Ref<HTMLDivElement>;
  desktop?: boolean;
}) {
  const { containerRef, desktop } = props;

  return (
    <AboutPageContainer ref={containerRef} id="about-page-container">
      <Switch>
        <Route exact path={`/about/a2hs`}>
          <A2HSInstructions />
        </Route>

        {/* must exactly match /about if on mobile */}
        <Route exact={!desktop} path={desktop ? "/*" : "/about"}>
          <WriteUp />
        </Route>
      </Switch>
    </AboutPageContainer>
  );
}

export default AboutPage;
