import styled from "styled-components";

const RadicalsPageContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;

  scroll-snap-align: start;
  min-width: 100vw;
`;

function RadicalsPage() {
  return <RadicalsPageContainer>test test</RadicalsPageContainer>;
}

export default RadicalsPage;
