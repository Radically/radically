import React, { useEffect, useState } from "react";
import { register } from "../../src/serviceWorkerRegistration";
// import { useAddToHomescreenPrompt } from "../utils";

const defaultValue = {
  initialized: false,
  installing: null as ServiceWorker | null,
  active: null as ServiceWorker | null,
  freshlyInstalled: false,
  updateAvailable: false,
};

export const ServiceWorkerContext = React.createContext(defaultValue);

const ServiceWorkerStateProvider = (props: {
  children: React.ReactElement;
}) => {
  const { children } = props;

  /* const [prompt, promptToInstall] = useAddToHomescreenPrompt();

  React.useEffect(() => {
    if (prompt) {
      // setVisibleState(true);
      console.log("sw beforeinstalled", prompt);
    }
  }, [prompt]); */

  const [initialized, setInitialized] = useState(false);
  const [active, setActive] = useState<ServiceWorker | null>(null);
  const [installing, setInstalling] = useState<ServiceWorker | null>(null);
  const [freshlyInstalled, setFreshlyInstalled] = useState(false);

  const [updateAvailable, setUpdateAvailable] = useState(false);

  const context = {
    initialized,
    active,
    installing,
    freshlyInstalled,
    updateAvailable,
  };

  // register promise has resolved but may not be actually installed yet
  const onSWInitialized = (registration: ServiceWorkerRegistration) => {
    console.log("sw inited", registration);
    setInitialized(true);
    setInstalling(registration.installing);
    setActive(registration.active);
  };

  const onSWSuccess = (registration: ServiceWorkerRegistration) => {
    console.log("sw success", registration);
    setFreshlyInstalled(true);
    setInstalling(registration.installing);
    setActive(registration.active);
  };

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    console.log("sw updated", registration);
    setUpdateAvailable(true);
    setInstalling(registration.installing);
    setActive(registration.active);
  };

  useEffect(() => {
    register({
      onUpdate: onSWUpdate,
      onSuccess: onSWSuccess,
      onInitialized: onSWInitialized,
    });
  }, []);

  return (
    <ServiceWorkerContext.Provider value={context}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};

export default ServiceWorkerStateProvider;
