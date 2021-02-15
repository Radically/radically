import { makeStyles, Portal, Snackbar } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import React, { useContext } from "react";
import { QuickToastContext } from "../../contexts/QuickToastContextProvider";

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

function QuickToast() {
  const snackbarStyles = useSnackbarStyles();

  const { snackbarText, open, close, duration } = useContext(QuickToastContext);

  return (
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
        autoHideDuration={duration}
        onClose={close}
        message={snackbarText}
      />
    </Portal>
  );
}

export default QuickToast;
