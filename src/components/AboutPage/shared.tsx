import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import styled from "styled-components";

export const SectionTitle = styled.h4<{
  locale?: string;
  darkMode?: boolean;
  small?: boolean;
}>`
  display: inline-block;

  /* font-size: ${(props) => (props.locale === "en" ? "0.8rem" : "1.2rem")}; */

  font-size: ${(props) => (props.small ? 1.2 : 1.5)}rem;

  margin: 0px;

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

export const SectionParagraph = withTheme(styled.p`
  font-size: 0.95rem;
  // text-align: justify;
  // padding-top: 5px;
  margin: 0.5rem 0 0.5rem 0;
  font-weight: normal;
  color: ${(props) => props.theme.palette.text.primary};

  a:link {
    color: ${(props: { darkMode?: boolean }) =>
      props.darkMode ? teal[300] : teal[800]};
  }

  a:visited {
    color: ${(props) => props.theme.palette.text.primary};
  }

  a:hover {
    color: ${(props: { darkMode?: boolean }) =>
      props.darkMode ? teal[300] : teal[800]};
  }

  a:active {
    color: ${(props: { darkMode?: boolean }) =>
      props.darkMode ? teal[300] : teal[800]};
  }
`);

export const LargeSpan = styled.span`
  font-size: 2rem;
`;
