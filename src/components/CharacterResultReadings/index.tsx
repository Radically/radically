import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { DataContext } from "../../contexts/DataContextProvider";
import { getStringForCharacterVariants } from "../ComponentsScrollComponents/utils";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles, withTheme } from "@material-ui/core/styles";
import { QuickToastContext } from "../../contexts/QuickToastContextProvider";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";

// import SimpleBar from "simplebar-react";

const Container = styled.div`
  //   min-height: 300px;

  //   box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  // border-radius: 5px;
  //   align-items: center;

  overflow-wrap: anywhere;
  // bottom navbar + 10px padding
  /* @supports not (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      margin-bottom: calc(56px + 10px);
    }
  }

  @supports (-webkit-touch-callout: none) {
    margin-bottom: 10px;
    height: 0;
  }

  @media (orientation: landscape) {
    margin-bottom: 10px;
  } */

  padding: 10px;
`;

const MetadataContainer = styled.div`
  padding-bottom: 10px;
  font-weight: bold;
`;

const useButtonGroupStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: "10px",
    width: "100%",
  },
}));

const useButtonStyles = makeStyles((theme) => ({
  root: {
    fontSize: "9pt",
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
  },
}));

const ReadingsContainer = withTheme(styled.div`
  font-size: 0.9rem;
  a:link {
    color: ${(props) => props.theme.palette.text.primary};
  }

  a:visited {
    color: ${(props) => props.theme.palette.text.primary};
  }

  a:hover {
    color: ${(props) => props.theme.palette.text.primary};
  }

  a:active {
    color: ${(props) => props.theme.palette.text.primary};
  }
`);

const CharacterResultReadings = React.memo(
  (props: {
    char: string;
    readings: Readings;
    toastOnGetRelated?: boolean;
  }) => {
    const { char, readings, toastOnGetRelated } = props;
    const intl = useIntl();
    const { showText } = useContext(QuickToastContext);
    const buttonStyles = useButtonStyles();
    const buttonGroupStyles = useButtonGroupStyles();
    const { variantsLocales, reverseMapIDSOnly } = useContext(DataContext);
    const {
      output,
      setOutput,
      relatedComponentsInput,
      setRelatedComponentsInput,
      componentsInput,
      setComponentsInput,
    } = useContext(SharedTextboxContext);
    const variantsString = getStringForCharacterVariants(
      variantsLocales[char]?.v,
      intl
    );

    const addToSearch = () => {
      setComponentsInput(componentsInput + char);
      showText(
        intl.formatMessage({
          id: "added",
        })
      );
    };

    function addToComponents() {
      setRelatedComponentsInput(relatedComponentsInput + char);
      if (toastOnGetRelated) {
        showText(
          intl.formatMessage({
            id: "resultspage.added_to_components_page",
          })
        );
      }
    }

    function copyToClipboard() {
      navigator.clipboard.writeText(char);
      showText(
        intl.formatMessage({
          id: "copied_to_clipboard",
        })
      );
    }

    function addToOutput() {
      setOutput(output + char);
    }

    return (
      <Container>
        <ButtonGroup
          size="small"
          color="primary"
          aria-label="outlined primary button group"
          classes={buttonGroupStyles}
        >
          <Button onClick={addToSearch} classes={buttonStyles}>
            <FormattedMessage
              id="componentspage.add_to_search"
              defaultMessage="Add to search"
            />
          </Button>
          <Button onClick={addToComponents} classes={buttonStyles}>
            <FormattedMessage
              id="componentspage.get_related"
              defaultMessage="Get related"
            />
          </Button>
        </ButtonGroup>

        <ButtonGroup
          size="small"
          color="primary"
          aria-label="outlined primary button group"
          classes={buttonGroupStyles}
        >
          {navigator.clipboard && window.isSecureContext && (
            <Button onClick={copyToClipboard} classes={buttonStyles}>
              <FormattedMessage id="copy" defaultMessage="Copy" />
            </Button>
          )}
          <Button onClick={addToOutput} classes={buttonStyles}>
            <FormattedMessage id="output" defaultMessage="Output" />
          </Button>
        </ButtonGroup>

        <div style={{ display: "flex" }}>
          <div
            style={{
              position: "relative",
              fontSize: "35pt",
              lineHeight: 1,
              paddingRight: "10px",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: "10px",
                textAlign: "center",
              }}
            >
              {char}

              {/* <ButtonGroup
              size="small"
              orientation="vertical"
              color="primary"
              aria-label="vertical contained primary button group"
              variant="text"
              classes={buttonGroupStyles}
            >
              <Button classes={buttonStyles}>Copy</Button>
              <Button classes={buttonStyles}>Output</Button>
            </ButtonGroup> */}
            </div>
          </div>

          {/* <SimpleBar style={{ flex: 1, paddingTop: "5px", height: "100px" }}> */}
          {/* <div> */}
          <ReadingsContainer>
            {variantsString && (
              <MetadataContainer>{variantsString}</MetadataContainer>
            )}
            <MetadataContainer>
              {`U+${char.codePointAt(0)?.toString(16).toUpperCase()} ${
                reverseMapIDSOnly[char]?.map(({ i }) => i).join(" • ") || ""
              }`}
            </MetadataContainer>
            {char in readings ? (
              Object.entries(readings[char]).map((entry) => (
                <div>
                  <span
                    style={{ fontWeight: "bold", overflowWrap: "anywhere" }}
                  >
                    {entry[0]}:
                  </span>{" "}
                  <div
                    style={{ display: "inline" }}
                    dangerouslySetInnerHTML={{ __html: entry[1] }}
                  />
                </div>
              ))
            ) : (
              <div>
                {intl.formatMessage({
                  id: "no_info",
                })}
              </div>
            )}
          </ReadingsContainer>
        </div>
        {/* </div> */}
        {/* </SimpleBar> */}
      </Container>
    );
  }
);

export default CharacterResultReadings;
