// Add to Home Screen instructions
import React, { useContext } from "react";
import { teal } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MenuIcon from "@material-ui/icons/Menu";

import { Link, useHistory } from "react-router-dom";

import styled from "styled-components";
import { SettingsContext } from "../../contexts/SettingsContextProvider";

import { SectionTitle, SectionParagraph } from "./shared";

const BackButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  padding-bottom: 1rem;
`;

const BackButtonText = styled.span`
  /* Create the gradient. */
  font-size: 1.5rem;
  background-image: linear-gradient(
    60deg,
    ${(props: { darkMode?: boolean }) =>
      props.darkMode ? teal[300] : teal[800]},
    ${(props: { darkMode?: boolean }) => (props.darkMode ? "white" : "black")}
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

const useBackButtonArrowStyles = makeStyles((theme: any) => ({
  root: (props: { darkMode?: boolean }) => ({
    color: props.darkMode ? teal[300] : teal[800],
    paddingRight: theme.spacing(1),
  }),
}));

function A2HSInstructions() {
  const { darkMode } = useContext(SettingsContext);
  const history = useHistory();
  const backButtonArrowStyles = useBackButtonArrowStyles({ darkMode });

  const navigateToAbout = (e: React.MouseEvent) => {
    history.replace("/about");
  };

  return (
    <>
      <BackButton onClick={navigateToAbout}>
        <ArrowBackIcon fontSize={"large"} classes={backButtonArrowStyles} />
        <BackButtonText darkMode={darkMode}>Back</BackButtonText>
      </BackButton>

      <div>
        <SectionTitle darkMode={darkMode}>Desktop</SectionTitle>
      </div>

      <div>
        <SectionTitle small darkMode={darkMode}>
          Chrome
        </SectionTitle>
        <SectionParagraph>
          Find the install button at the right end of the address bar, or the{" "}
          <MoreVertIcon /> icon, then click "Install Radically".
        </SectionParagraph>
      </div>

      <div>
        <SectionTitle small darkMode={darkMode}>
          Edge
        </SectionTitle>
        <SectionParagraph>
          Find the install button at the right end of the address bar, or the{" "}
          <MoreHorizIcon /> icon, then click "Apps", then click "Install
          Radically".
        </SectionParagraph>
      </div>

      <div>
        <SectionTitle small darkMode={darkMode}>
          Vivaldi
        </SectionTitle>
        <SectionParagraph darkMode={darkMode}>
          Make sure that "Menu entries for installing Progressive Web Apps" is
          enabled in{" "}
          <Link
            target="_blank"
            to={{
              pathname: "vivaldi://experiments/",
            }}
          >
            vivaldi://experiments/
          </Link>
          . Right click on the tab, then click "Install Radically".
        </SectionParagraph>
      </div>

      <div>
        <SectionTitle darkMode={darkMode}>Android</SectionTitle>
      </div>
      <div>
        <SectionTitle small darkMode={darkMode}>
          Chrome & Opera
        </SectionTitle>
      </div>

      <SectionParagraph>
        Find the <MoreVertIcon /> icon, then tap "Add to Home screen".
      </SectionParagraph>

      <div>
        <SectionTitle small darkMode={darkMode}>
          Firefox
        </SectionTitle>
      </div>
      <SectionParagraph>
        Find the <MoreVertIcon /> icon, then tap "Install".
      </SectionParagraph>

      <div>
        <SectionTitle small darkMode={darkMode}>
          Samsung Internet
        </SectionTitle>
      </div>

      <SectionParagraph>
        Find the <MenuIcon /> icon, then tap "Add Page to Home Screen".
      </SectionParagraph>

      <div>
        <SectionTitle darkMode={darkMode}>iOS</SectionTitle>
      </div>

      <div>
        <SectionTitle small darkMode={darkMode}>
          Safari
        </SectionTitle>
      </div>

      <SectionParagraph>
        Find the{" "}
        <svg
          width="30px"
          height="30px"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 88.38 111.87"
        >
          <path d="M44.24,72.85a4.55,4.55,0,0,0,4.54-4.49V19.24L48.44,12l3,3.57,6.83,7.27a4,4,0,0,0,3,1.32,3.91,3.91,0,0,0,2.78-6.84L47.71,1.56A4.7,4.7,0,0,0,44.24,0a4.61,4.61,0,0,0-3.47,1.56L24.37,17.33a3.93,3.93,0,0,0-1.32,2.93,3.89,3.89,0,0,0,4.05,3.91,4.16,4.16,0,0,0,3.08-1.32L37,15.58,40,12l-.39,7.28V68.36A4.56,4.56,0,0,0,44.24,72.85Zm-28.18,39H72.31c10.6,0,16.07-5.47,16.07-15.92V48C88.38,37.5,82.91,32,72.31,32H59.13v9.72H71.68c4.44,0,7,2.34,7,7V95.07c0,4.69-2.54,7-7,7h-55c-4.49,0-7-2.34-7-7V48.78c0-4.69,2.49-7,7-7H29.39V32H16.06C5.52,32,0,37.45,0,48V96C0,106.4,5.52,111.87,16.06,111.87Z" />
        </svg>{" "}
        icon, then tap "Add to Home Screen".
      </SectionParagraph>
    </>
  );
}

export default A2HSInstructions;
