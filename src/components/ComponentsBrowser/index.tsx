import grey from "@material-ui/core/colors/grey";
import { withTheme } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import styled from "styled-components";

export const LandscapeHandle = styled.div`
  width: 30px;
  background: repeating-linear-gradient(
    45deg,
    ${grey[300]},
    ${grey[300]} 10px,
    ${grey[800]} 10px,
    ${grey[800]} 20px
  );
`;

export const StrokesScrollContainerSimpleBar = withTheme(styled(
  SimpleBar
).attrs((props) => ({
  autoHide: false,
}))`
  width: 50px;
  float: left;
  border-right: 1px solid #909090;
  min-height: 100%;
  height: 0px;
  color: ${(props) => props.theme.palette.text.primary};
`);

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

  // hide scrollbars
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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

  // hide scrollbars
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
