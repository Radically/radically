// yep, i'm not very imaginative
// the page with the welcome name and the radical and ids text boxes

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

import { Input, AppNameh1, AppDesch3, useButtonStyles } from "./shared";

export const AppNameDescWrapper = styled.div`
  width: 75%;
  @media (max-width: 700px) and (orientation: landscape) {
    width: 90%;
  }

  padding-bottom: 0.8rem;
  display: flex;
  flex-direction: column;
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
    // padding-top: 10px;
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

function FirstPage(props: { scrollToResults: () => void }) {
  const { scrollToResults } = props;
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
  const intl = useIntl();
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

  const { showText } = useContext(QuickToastContext);

  const buttonStyles = useButtonStyles();

  const [idcs, setIDCs] = useState("");

  const search = async () => {
    const hasResults = await performSearch(
      componentsInput,
      idcs,
      atLeastComponentFreq,
      useWebWorker
    );

    if (hasResults) {
      scrollToResults();
    } else {
      showText(
        intl.formatMessage({
          id: "no_results",
        })
      );
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.key === "Enter") {
      if (loading || !componentsInput.length) return;
      (e.target as HTMLInputElement).blur();
      search();
    }
  };

  return (
    <FirstPageContainer id="first-page-container">
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

      <AppNameDescWrapper>
        <div>
          <AppNameh1 locale={intl.locale} darkMode={darkMode}>
            <FormattedMessage id="app_name" defaultMessage="Radically" />
          </AppNameh1>
        </div>
        <div>
          <AppDesch3 locale={intl.locale} darkMode={darkMode}>
            <FormattedMessage
              id="app_desc"
              defaultMessage="A CJK character components-based search tool"
            />
          </AppDesch3>
        </div>
      </AppNameDescWrapper>

      <LetterBox>
        <RadicalIDSFlex>
          <div style={{ width: "100%" }}>
            <InputLabel htmlFor="components-search-input">
              <FormattedMessage id="components" defaultMessage="Components" />
            </InputLabel>
            <Input
              id="components-search-input"
              value={componentsInput}
              onKeyUp={handleEnterKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setComponentsInput(e.target.value);
              }}
              placeholder="飠喜"
            />
          </div>

          <div style={{ width: "100%", paddingTop: "10px" }}>
            <InputLabel htmlFor="idcs-search-input">
              <FormattedMessage id="idcs" defaultMessage="IDCs" />
            </InputLabel>
            <Input
              id="idcs-search-input"
              onKeyUp={handleEnterKey}
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
            onClick={search}
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
