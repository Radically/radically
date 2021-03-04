import teal from "@material-ui/core/colors/teal";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { FunctionComponent, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";
import IDSPicker from "../IDSPicker";
import { DataContext } from "../../contexts/DataContextProvider";
import { SearchContext } from "../../contexts/SearchContextProvider";
import { QuickToastContext } from "../../contexts/QuickToastContextProvider";

export const Input = withTheme(styled.input.attrs((props) => ({
  // we can define static props
  type: "search",

  // or we can define dynamic ones
  size: props.size || "0.5em",
}))`
  // display: block;
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 1em;
  font-family: var(--default-sans);
  font-weight: bold;
  border: 1px solid #909090;
  // border-radius: 2px;

  /* here we use the dynamically computed prop */
  // margin: ${(props) => props.size};
  margin-top: ${(props) => props.size};
  padding: ${(props) => props.size};

  &:focus {
    border: 2px solid black;
  }

  box-sizing: border-box;
  background-color: ${(props) => props.theme.palette.background.paper};
  width: 100%;
`);

export const AppNameh1 = styled.h1<{ locale?: string; darkMode?: boolean }>`
  display: inline-block;
  font-size: ${(props) => (props.locale === "en" ? "2.5rem" : "3rem")};

  @media screen and (max-height: 600px) {
    font-size: 2rem;
  }

  margin: 0px;
  /* Create the gradient. */
  background-image: linear-gradient(
    60deg,
    ${(props) => (props.darkMode ? "white" : "black")},
    ${(props) => (props.darkMode ? teal[300] : teal[800])}
  );

  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

export const AppDesch3 = styled.h3<{ locale?: string; darkMode?: boolean }>`
  display: inline-block;

  // iPhone SE
  @media screen and (orientation: portrait) and (max-height: 550px) {
    display: none;
  }

  font-size: ${(props) => (props.locale === "en" ? "0.8rem" : "1.2rem")};

  margin: 0px;

  // background-color: #ca4246;
  // background-color: red;

  /* Create the gradient. */
  background-image: linear-gradient(
    60deg,
    ${(props: { darkMode?: boolean }) => (props.darkMode ? "white" : "black")},
    ${(props: { darkMode?: boolean }) =>
      props.darkMode ? teal[300] : teal[800]}
  );

  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

export const useButtonStyles = makeStyles((theme) => ({
  root: {
    fontSize: "12pt",
    borderRadius: 0,
    // fontFamily: "var(--default-sans);",
    // fontWeight: "bold",
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    lineHeight: "1.2em",
    "&:hover": {
      border: `2px solid ${theme.palette.primary.main}`,
    },
    "&:active": {
      border: `2px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    width: "100%",
    marginTop: "10px",
  },

  disabled: {
    fontSize: "12pt",
    borderRadius: 0,
    width: "100%",
    marginTop: "10px",
    border: `2px solid ${theme.palette.action.disabled}`,
  },
}));
