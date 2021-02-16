import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import { DataContext } from "../../contexts/DataContextProvider";
import { getStringForCharacterVariants } from "../ComponentsPage/utils";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import { QuickToastContext } from "../../contexts/QuickToastContextProvider";
import { SharedTextboxContext } from "../../contexts/SharedTextboxContextProvider";

// import SimpleBar from "simplebar-react";

const Container = styled.div`
  //   min-height: 300px;

  //   box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  // border-radius: 5px;
  //   align-items: center;

  // bottom navbar + 10px padding
  @supports not (-webkit-touch-callout: none) {
    @media (orientation: portrait) {
      margin-bottom: calc(56px + 10px);
    }
  }

  @supports (-webkit-touch-callout: none) {
    margin-bottom: 10px;
  }

  @media (orientation: landscape) {
    margin-bottom: 10px;
  }

  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;

const VariantsStringContainer = styled.div`
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

const CharacterResultReadings = React.memo(
  (props: { char: string; readings: Readings }) => {
    const { char, readings } = props;
    const intl = useIntl();
    const { showText } = useContext(QuickToastContext);
    const buttonStyles = useButtonStyles();
    const buttonGroupStyles = useButtonGroupStyles();
    const { variantsLocales } = useContext(DataContext);
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
    return (
      <Container>
        <ButtonGroup
          size="small"
          color="primary"
          aria-label="outlined primary button group"
          classes={buttonGroupStyles}
        >
          <Button
            onClick={() => {
              setComponentsInput(componentsInput + char);
              showText(
                intl.formatMessage({
                  id: "added",
                })
              );
            }}
            classes={buttonStyles}
          >
            <FormattedMessage
              id="componentspage.add_to_search"
              defaultMessage="Add to search"
            />
          </Button>
          <Button
            onClick={() => {
              setRelatedComponentsInput(relatedComponentsInput + char);
            }}
            classes={buttonStyles}
          >
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
            <Button
              onClick={() => {
                navigator.clipboard.writeText(char);
                showText(
                  intl.formatMessage({
                    id: "copied_to_clipboard",
                  })
                );
              }}
              classes={buttonStyles}
            >
              <FormattedMessage id="copy" defaultMessage="Copy" />
            </Button>
          )}
          <Button
            onClick={() => {
              setOutput(output + char);
            }}
            classes={buttonStyles}
          >
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
          <div style={{ fontSize: "0.9rem" }}>
            {variantsString && (
              <VariantsStringContainer>
                {variantsString}
              </VariantsStringContainer>
            )}
            {char in readings ? (
              Object.entries(readings[char]).map((entry) => (
                <div>
                  <span style={{ fontWeight: "bold" }}>{entry[0]}:</span>{" "}
                  {entry[1]}
                </div>
              ))
            ) : (
              <div>
                {intl.formatMessage({
                  id: "no_info",
                })}
              </div>
            )}
          </div>
        </div>
        {/* </div> */}
        {/* </SimpleBar> */}
      </Container>
    );
  }
);

export default CharacterResultReadings;
