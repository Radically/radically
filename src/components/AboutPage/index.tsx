import teal from "@material-ui/core/colors/teal";
import { withTheme } from "@material-ui/core/styles";
import { useContext } from "react";
import { useIntl } from "react-intl";
import styled from "styled-components";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { heightPx } from "../OutputBar";

export const SectionTitle = styled.h4<{ locale?: string; darkMode?: boolean }>`
  display: inline-block;

  /* font-size: ${(props) => (props.locale === "en" ? "0.8rem" : "1.2rem")}; */

  font-size: 1.5rem;

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

export const SectionBody = withTheme(styled.p`
  font-size: 1.1rem;
  // text-align: justify;
  padding-top: 5px;
  font-weight: normal;
  color: ${(props) => props.theme.palette.text.primary};
`);

const AboutPageContainer = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  padding: 15px;
`;

function AboutPage(props: { containerRef?: React.Ref<HTMLDivElement> }) {
  const { containerRef } = props;
  const intl = useIntl();
  const { darkMode } = useContext(SettingsContext);

  return (
    <AboutPageContainer ref={containerRef} id="about-page-container">
      <div>
        <SectionTitle darkMode={darkMode}>Stats</SectionTitle>
      </div>

      <SectionBody>
        Current Version: {process.env.REACT_APP_VERSION}
      </SectionBody>

      <div>
        <SectionTitle darkMode={darkMode}>Changelog</SectionTitle>
      </div>

      <div>
        <SectionTitle darkMode={darkMode}>Get in touch</SectionTitle>
      </div>

      <div>
        <SectionTitle darkMode={darkMode}>Usage</SectionTitle>
      </div>

      <div>
        <SectionTitle id="footnotes" darkMode={darkMode}>
          Footnotes
        </SectionTitle>
      </div>

      <SectionBody>
        ① The number of occurrences of each unique component in a resulting
        character {">="} the number of times that component is entered in the
        input box, if turned on.
        <br />
        <br />
        For instance, 人人人 will return 傘 (4x 人), 众 (3x 人), and 齒 (4x 人),
        and not 从 (2x 人), 纵 (2x 人), 齿 (1x 人). 口土土 will return 哇 (1x
        口, 2x 土), and not 吐 (1x 口, 1x 土).
      </SectionBody>

      <SectionBody>
        ② Turn this on if your device is unresponsive when searching. As of the
        time of writing, nearly 99,000 characters are indexed. For efficient
        retrieval, the data is organized as a directed graph, i.e.
        <br />
        <br />人 ➞ 内 个 亥 亼 <span style={{ fontWeight: "bold" }}>从</span>
        ...
        <br />从 ➞ 丛 两 众 來 從... <br />
        <br />
        Thus, a <span style={{ fontStyle: "italic" }}>complete</span> search
        algorithm must be used to transitively obtain all characters. In my
        brief tests;
        <br />
        <br />一 (as can be expected) is likely the worst-case single-character
        query: ~54,500 results, with ~64800 edges (pairs of characters)
        traversed; ~300 ms elapsed on a Snapdragon 425 phone. This process has
        to be repeated for each unique character entered.
        <br />
        <br />
        一丨人 consumes ~500-600 ms, traversing around 116,500 edges.
        <br />
        <br />
        The search will be offloaded to a web worker if turned on, to avoid the
        fairly unlikely situation where the UI thread is blocked for a long
        time. Very few characters have normalized IDSes composed of more than 5
        or 6 unique characters, even in contrived situations such as U+291D2 𩇒,
        the infamous 鬱, or <span style={{ fontStyle: "italic" }}>biang</span>.
      </SectionBody>

      <div>
        <SectionTitle darkMode={darkMode}>Acknowledgements</SectionTitle>
      </div>
    </AboutPageContainer>
  );
}

export default AboutPage;
