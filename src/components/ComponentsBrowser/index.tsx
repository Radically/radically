import { withTheme } from "@material-ui/core/styles";
import styled from "styled-components";

export const StrokesScrollContainer = withTheme(styled.div`
  // flex: 0.1;
  width: 50px;
  float: left;

  // background-color: green;
  border-right: 1px solid #909090;

  // do i really have to set a height here??
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;

  color: ${(props) => props.theme.palette.text.primary};
`);

export const StrokesComponentsContainer = styled.div`
  // @media (orientation: portrait) {
  border-bottom: 1px solid #909090;
  // }
  // flex-grow: 1;
`;

export const RadicalsScrollContainer = styled.div`
  // flex: 0.1;
  width: calc(100% - 51px - 10px - 10px);
  float: right;

  // background-color: purple;

  // do i really have to set a height here??
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;

  padding-left: 10px;
  padding-right: 10px;
`;

export const ReadingsScrollContainer = withTheme(styled.div`
  // background-color: blue;
  flex-grow: 1;
  overflow-y: scroll;

  border-top: 1px solid #909090;
  color: ${(props) => props.theme.palette.text.primary};
`);

export const CenterTextContainer = withTheme(styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--default-sans);
  font-size: 1.5em;
  // font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
`);

export const LoadingTextContainer = withTheme(styled.div`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--default-sans);
  font-size: 1.5em;
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  }

  animation: fadeIn 1s infinite alternate;
`);
