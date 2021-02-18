// yep, i'm not very imaginative
// the page with the welcome name and the radical and ids text boxes

import teal from "@material-ui/core/colors/teal";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import { FunctionComponent, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";
import IDSPicker from "../IDSPicker";
import { DataContext } from "../../contexts/DataContextProvider";
import { SearchContext } from "../../contexts/SearchContextProvider";

const Input = withTheme(styled.input.attrs((props) => ({
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

const AppNameh1 = styled.h1`
  font-size: 1.5rem;
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

const FirstPageContainer = withTheme(styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;

  scroll-snap-align: start;
  min-width: 100vw;
`);

const LetterBox = styled.div`
  width: 75%;
  @media (max-width: 700px) and (orientation: landscape) {
    width: 90%;
  }

  display: flex;

  @media (orientation: portrait) {
    flex-direction: column;
  }
`;

const RadicalIDSFlex = styled.div`
  flex: 0.8;
`;

const ToggleButtonFlex = styled.div`
  flex: 0.2;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (orientation: landscape) {
    padding-left: 20px;
  }

  @media (orientation: portrait) {
    // the switches and search button should be on the same baseline in portrait mode
    align-items: flex-end;

    // add padding to the top
    padding-top: 10px;
  }
`;

const InputLabel = withTheme(styled.label`
  font-size: 10pt;
  font-weight: bold;
  // display: block;
  color: ${(props) => props.theme.palette.text.primary};
`);

const FirstPageSwitchCaption = withTheme(styled("div")`
  font-size 10pt;
  text-align: justify;
  padding-top: 5px;
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
`);

const _SwitchLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (orientation: portrait) {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const SwitchLabelContainer: FunctionComponent<{}> = (props) => {
  const { children } = props;
  return <_SwitchLabelContainer>{children}</_SwitchLabelContainer>;
};

const useButtonStyles = makeStyles((theme) => ({
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

function FirstPage() {
  const {
    atLeastComponentFreq,
    setAtLeastComponentFreq,
    useWebWorker,
    setUseWebWorker,

    darkMode,
    setDarkMode,

    locale,
    setLocale,
  } = useContext(SettingsContext);

  const { componentsInput, setComponentsInput } = useContext(
    SharedTextboxContext
  );

  const {
    forwardMap,
    forwardMapLoading,

    reverseMapCharFreqsOnly,
    reverseMapCharFreqsOnlyLoading,
  } = useContext(DataContext);

  const loading = forwardMapLoading || reverseMapCharFreqsOnlyLoading;

  const { searching, performSearch } = useContext(SearchContext);

  const buttonStyles = useButtonStyles();

  const [idcs, setIDCs] = useState("");

  return (
    <FirstPageContainer>
      <IconButton
        onClick={() => {
          setDarkMode(!darkMode);
        }}
        style={{
          position: "absolute",
          right: 15,
          top: 15,
        }}
        color="primary"
        id="darkmode-toggle"
        aria-label="toggle dark theme"
        component="span"
      >
        {darkMode ? <Brightness3Icon /> : <WbSunnyIcon />}
      </IconButton>

      <IconButton
        onClick={() => {
          setLocale(locale === "en" ? "lzh" : "en");
        }}
        style={{
          fontFamily: "var(--default-sans)",
          fontWeight: "bold",
          position: "absolute",
          right: 60,
          top: 15,
        }}
        color="primary"
        id="darkmode-toggle"
        aria-label="toggle dark theme"
        component="span"
      >
        {locale === "en" ? "EN" : "漢"}
      </IconButton>

      <AppNameh1 darkMode={darkMode}>部首組合式漢字檢索</AppNameh1>
      <LetterBox>
        <RadicalIDSFlex>
          <div style={{ width: "100%" }}>
            <InputLabel>
              <FormattedMessage id="components" defaultMessage="Components" />
            </InputLabel>
            <Input
              value={componentsInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setComponentsInput(e.target.value);
              }}
              placeholder="食喜"
            />
          </div>

          <div style={{ width: "100%", paddingTop: "10px" }}>
            <InputLabel>
              <FormattedMessage id="idcs" defaultMessage="IDCs" />
            </InputLabel>
            <Input
              onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                setIDCs(evt.target.value);
              }}
              value={idcs}
              placeholder="⿰⿱"
            />
          </div>

          <IDSPicker onIDSSelected={(idc) => setIDCs(idcs + idc)} />
        </RadicalIDSFlex>

        <ToggleButtonFlex>
          <SwitchLabelContainer>
            <Switch
              color="primary"
              checked={atLeastComponentFreq}
              onChange={(e) => {
                setAtLeastComponentFreq(!atLeastComponentFreq);
              }}
            />

            <FirstPageSwitchCaption>
              <FormattedMessage
                id="component_freq"
                defaultMessage="Component freq."
              />
              *
            </FirstPageSwitchCaption>
          </SwitchLabelContainer>

          <SwitchLabelContainer>
            <Switch
              id="radical-frequency-switch"
              color="primary"
              checked={useWebWorker}
              onChange={(e) => {
                setUseWebWorker(!useWebWorker);
              }}
            />

            <FirstPageSwitchCaption>
              <FormattedMessage
                id="use_web_worker"
                defaultMessage="Use web worker"
              />
            </FirstPageSwitchCaption>
          </SwitchLabelContainer>

          {/* force flex wrap onto next line */}
          <div style={{ flexBasis: "100%", height: 0 }} />

          <Button
            disabled={loading || !componentsInput.length}
            onClick={async () => {
              console.log(
                await performSearch(
                  componentsInput,
                  idcs,
                  atLeastComponentFreq,
                  useWebWorker
                )
              );
            }}
            classes={buttonStyles}
          >
            {searching && (
              <FormattedMessage id="searching" defaultMessage="Searching..." />
            )}
            {loading && (
              <FormattedMessage id="loading" defaultMessage="Loading..." />
            )}
            {!loading && !searching && (
              <FormattedMessage id="search" defaultMessage="Search" />
            )}
          </Button>
        </ToggleButtonFlex>
      </LetterBox>
    </FirstPageContainer>
  );
}

export default FirstPage;
