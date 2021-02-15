import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import AssignmentSharpIcon from "@material-ui/icons/AssignmentSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import React, { useContext, useState } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { OutputContext } from "../../contexts/OutputContextProvider";
import Snackbar from "@material-ui/core/Snackbar";
import Portal from "@material-ui/core/Portal";
import teal from "@material-ui/core/colors/teal";

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

const useSnackbarStyles = makeStyles((theme) => ({
  snackBar: {
    "@media (orientation: portrait)": {
      bottom: 65,
    },
  },
  root: {
    backgroundColor: teal[800],
    color: "white",
  },
}));

function OutputBar() {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const { output, setOutput } = useContext(OutputContext);

  const snackbarStyles = useSnackbarStyles();

  const close = () => {
    setOpen(false);
  };
  return (
    <OutputBarContainer id="output-bar">
      <Portal>
        <Snackbar
          className={snackbarStyles.snackBar}
          ContentProps={{
            classes: {
              root: snackbarStyles.root,
            },
          }}
          onClick={close}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={open}
          autoHideDuration={1500}
          onClose={close}
          message={intl.formatMessage({
            id: "copied_to_clipboard",
          })}
          // action={
          //   <React.Fragment>
          //     <IconButton size="small" aria-label="close" color="inherit" onClick={close}>
          //       <CloseIcon fontSize="small" />
          //     </IconButton>
          //   </React.Fragment>
          // }
        />
      </Portal>
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
            setOpen(true);
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
