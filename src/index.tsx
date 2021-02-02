import React from "react";
import ReactDOM from "react-dom";
// import "semantic-ui-css/semantic.min.css";
import "./index.css";
import "simplebar/dist/simplebar.min.css";
// import "hanamin";
import "kaixinsong";
// import App from "./App";
import AppScreen from "./AppScreen";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <AppScreen />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
