import IconButton from "@material-ui/core/IconButton";
import { withTheme } from "@material-ui/core/styles";
import AssignmentSharpIcon from "@material-ui/icons/AssignmentSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { OutputContext } from "../../contexts/OutputContextProvider";
import { QuickToastContext } from "../../contexts/QuickToastContextProvider";

export const heightPx = 30;

const OutputBarContainer = withTheme(styled.div`
  position: sticky;
  width: 100vw;
  left: 0px;
  height: ${heightPx}px;
  background-color: ${(props) => props.theme.palette.background.paper};
  border-bottom: 1px solid #909090;
  display: flex;
  // padding-right: 5px;
  // margin-left: 10px;
`);

const Output = withTheme(
  styled.input.attrs((props) => ({
    // we can define static props
    // type: "search",

    // or we can define dynamic ones
    size: props.size || "0.5em",
  }))`
    flex: 1;
    // height: 45px;
    -webkit-appearance: none;
    outline: none;
    border: none;
    color: ${(props) => props.theme.palette.text.primary};
    background-color: transparent;
    font-size: 0.9em;
    font-family: var(--default-sans);
    font-weight: bold;
    box-sizing: border-box;
    margin-left: 10px;
  `
);

function OutputBar() {
  const intl = useIntl();
  const { output, setOutput } = useContext(OutputContext);

  const { showText } = useContext(QuickToastContext);

  return (
    <OutputBarContainer id="output-bar">
      <Output
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setOutput(e.target.value);
        }}
        value={output}
        placeholder={intl.formatMessage({
          id: "output",
        })}
      />

      <IconButton
        // size="small"
        onClick={() => {
          setOutput("");
        }}
        color="primary"
        id="clear-output"
        aria-label="clear output"
        component="span"
      >
        <CancelIcon />
      </IconButton>

      {navigator.clipboard && window.isSecureContext && (
        <IconButton
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(output);
            showText(
              intl.formatMessage({
                id: "copied_to_clipboard",
              })
            );
          }}
          color="primary"
          id="copy-to-clipboard"
          aria-label="copy to clipboard"
          component="span"
        >
          <AssignmentSharpIcon />
        </IconButton>
      )}
    </OutputBarContainer>
  );
}

export default OutputBar;
