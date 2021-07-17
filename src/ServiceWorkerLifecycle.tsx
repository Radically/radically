import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { IconButton, Button } from "@material-ui/core";
import { Close as IconClose } from "@material-ui/icons";

import { ServiceWorkerContext } from "./contexts/ServiceWorkerStateProvider";
import { SettingsContext } from "./contexts/SettingsContextProvider";
import {
  getInstalledPWAs,
  supportsGetInstalledPWAs,
  useIsMobile,
} from "./utils";
import moment from "moment";
import { InstallReminderDays } from "./constants";

const actionButtonStyles = {
  color: "white",
};

const ServiceWorkerLifecycle = () => {
  const history = useHistory();
  const { active, freshlyInstalled, updateAvailable, registration } =
    useContext(ServiceWorkerContext);

  const {
    installLastDismissed,
    setInstallLastDismissed,
    showInstall,
    setShowInstall,
  } = useContext(SettingsContext);

  const isMobile = useIsMobile();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const shouldShowFreshInstallNoti = async () => {
    // debugging
    // return true;

    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    if (params.get("utm_source") === "android_twa") return false;

    // freshly installed, unconditionally show!
    if (freshlyInstalled) return true;
    // no way to tell if it has installed, avoid showing after the 1st time
    if (!supportsGetInstalledPWAs()) return false;
    console.log(moment().diff(moment(installLastDismissed), "days"));

    const isPWAInstalled = (await getInstalledPWAs()) !== null;

    console.log("active, showInstall, isPWAInstalled");
    console.log(
      active,
      showInstall,
      moment().diff(moment(installLastDismissed), "seconds") >=
        InstallReminderDays,
      isPWAInstalled
    );
    if (
      active &&
      showInstall &&
      moment().diff(moment(installLastDismissed), "seconds") >=
        InstallReminderDays &&
      !isPWAInstalled
    )
      return true;
    return false;
  };

  // check for fresh install
  useEffect(() => {
    const check = async () => {
      if (!(await shouldShowFreshInstallNoti())) return;

      enqueueSnackbar(
        "Install Radically to search for characters instantly even while offline!",
        {
          variant: "success",
          key: "install-radically-tooltip",
          autoHideDuration: null,
          preventDuplicate: true,
          persist: true,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          action: (
            <>
              <Button
                style={actionButtonStyles}
                onClick={() => {
                  setInstallLastDismissed(new Date());
                  history.replace("/about/a2hs");
                  if (!isMobile) window.location.href = "#about-page-container";
                  closeSnackbar("install-radically-tooltip");
                }}
              >
                Guide
              </Button>

              <Button
                style={actionButtonStyles}
                onClick={() => {
                  setInstallLastDismissed(new Date());
                  if (isMobile) history.replace("/about");
                  else window.location.href = "#about-page-container";
                  closeSnackbar("install-radically-tooltip");
                }}
              >
                About
              </Button>

              <Button
                style={actionButtonStyles}
                onClick={() => {
                  setShowInstall(false);
                  closeSnackbar("install-radically-tooltip");
                }}
              >
                Dismiss Forever
              </Button>

              <IconButton
                style={actionButtonStyles}
                onClick={() => {
                  setInstallLastDismissed(new Date());
                  closeSnackbar("install-radically-tooltip");
                }}
              >
                <IconClose />
              </IconButton>
            </>
          ),
        }
      );
    };

    check();
  }, [active, freshlyInstalled, updateAvailable]);

  // check for update
  const performUpdate = async () => {
    // reload only after the new SW has been activated
    let reloading = false;
    navigator.serviceWorker?.addEventListener("controllerchange", () => {
      console.log("waiting skipped! reloading....");
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });

    if (registration?.waiting) {
      registration?.waiting.postMessage({ type: "SKIP_WAITING" });
      // controllerchange event doesn't fire in the wild sometimes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  useEffect(() => {
    if (!updateAvailable) return;
    enqueueSnackbar(
      "An update is available! Reload Radically for it to take effect.",
      {
        variant: "success",
        key: "update-radically-tooltip",
        autoHideDuration: null,
        preventDuplicate: true,
        persist: true,
        action: (
          <>
            <Button style={actionButtonStyles} onClick={performUpdate}>
              Reload
            </Button>

            <Button
              style={actionButtonStyles}
              onClick={() => {
                history.replace("/about");
                closeSnackbar("update-radically-tooltip");
              }}
            >
              Info
            </Button>

            <IconButton
              style={actionButtonStyles}
              onClick={() => closeSnackbar("update-radically-tooltip")}
            >
              <IconClose />
            </IconButton>
          </>
        ),
      }
    );
  }, [updateAvailable]);

  return <></>;
};

export default ServiceWorkerLifecycle;
