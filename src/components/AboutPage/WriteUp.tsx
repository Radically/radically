import { IconButton } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import moment from "moment";
import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { Link, useRouteMatch } from "react-router-dom";
import { DataContext } from "../../contexts/DataContextProvider";
import { ServiceWorkerContext } from "../../contexts/ServiceWorkerStateProvider";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import DiscordIcon from "./discord-icon";
import IconDescRow from "./GetInTouchRow";
import { discord, github, matrix } from "./links.json";
import MatrixIcon from "./matrix-icon";
import { LargeSpan, SectionParagraph, SectionTitle } from "./shared";
import UsageSection from "./usage-section";

const BoldSpan = styled.span`
  font-weight: bold;
`;

export default () => {
  const { darkMode } = useContext(SettingsContext);
  const { metadata } = useContext(DataContext);

  const {
    initialized,
    active,
    installing,
    // freshlyInstalled,
    updateAvailable,
  } = useContext(ServiceWorkerContext);

  return (
    <>
      <div>
        <SectionTitle darkMode={darkMode}>Updates & Stats</SectionTitle>

        <SectionParagraph darkMode={darkMode}>
          Current Version: {process.env.REACT_APP_VERSION}
        </SectionParagraph>

        <SectionParagraph darkMode={darkMode}>
          The Service Worker is... <br />
          {!initialized && <span>Not Initialized.</span>}{" "}
          {initialized && <span>Initialized.</span>}{" "}
          {active && <span>Active.</span>}{" "}
          {installing && (
            <span>
              <span className="loading">Installing</span>
            </span>
          )}
        </SectionParagraph>

        {initialized && !installing && (
          <SectionParagraph darkMode={darkMode}>
            Successfully installed. Follow{" "}
            <Link
              to={{
                pathname: `/about/a2hs`,
              }}
            >
              these instructions
            </Link>{" "}
            to add to home screen if you haven't already.
          </SectionParagraph>
        )}

        {updateAvailable && (
          <SectionParagraph darkMode={darkMode}>
            An update is available. Reload for the latest version.
          </SectionParagraph>
        )}
      </div>
      <SectionParagraph darkMode={darkMode}>
        {metadata?.entries} Unicode characters indexed.
        <br />
        {metadata?.pua_entries} PUA characters indexed.
        <br />
        Dataset generated on {moment(metadata?.date).toLocaleString()}.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        This compiled version is licensed under the{" "}
        <Link
          target="_blank"
          to={{
            pathname:
              "https://github.com/Radically/radically/blob/master/LICENSE",
          }}
        >
          GNU General Public License (GPL), version 2 or later
        </Link>
        . Scroll to the bottom to see dependencies.
      </SectionParagraph>

      <div>
        <SectionTitle darkMode={darkMode}>Get in touch</SectionTitle>
      </div>
      <IconDescRow
        icon={
          <IconButton
            size="small"
            aria-label="github-project-link"
            onClick={() => window.open(github)}
          >
            <GitHubIcon fontSize="large" />
          </IconButton>
        }
        desc={
          <SectionParagraph darkMode={darkMode}>
            Report issues, request new features, understand the inner workings
            of Radically, and join the discussion on{" "}
            <Link target="_blank" to={{ pathname: github }}>
              GitHub
            </Link>
            .
          </SectionParagraph>
        }
      />
      <IconDescRow
        icon={
          <IconButton
            onClick={() => window.open(discord)}
            size="small"
            aria-label="discord-invite"
          >
            <DiscordIcon width="35px" height="35px" />
          </IconButton>
        }
        desc={
          <SectionParagraph darkMode={darkMode}>
            Come chat about anything CJK-related on the{" "}
            <Link target="_blank" to={{ pathname: discord }}>
              Discord
            </Link>
            .
          </SectionParagraph>
        }
      />
      <IconDescRow
        icon={
          <IconButton
            onClick={() => window.open(matrix)}
            size="small"
            aria-label="matrix-invite"
          >
            <MatrixIcon width="35px" height="35px" />
          </IconButton>
        }
        desc={
          <SectionParagraph darkMode={darkMode}>
            Or the{" "}
            <Link target="_blank" to={{ pathname: matrix }}>
              Matrix
            </Link>{" "}
            room.
          </SectionParagraph>
        }
      />
      <SectionParagraph darkMode={darkMode}>
        Created and maintained by{" "}
        <Link target="_blank" to={{ pathname: "https://bryankok.com" }}>
          Bryan Kok
        </Link>
        .{" "}
        <Link
          target="_blank"
          to={{ pathname: "https://github.com/Transfusion" }}
        >
          GitHub
        </Link>
      </SectionParagraph>

      <UsageSection />

      <div>
        <SectionTitle id="footnotes" darkMode={darkMode}>
          Footnotes
        </SectionTitle>
      </div>
      <SectionParagraph darkMode={darkMode}>
        ❶ The IDCs in any of the IDSes of a resulting character must appear in
        the relative order entered.
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        For instance, <BoldSpan>⿹⿱</BoldSpan> matches 或 (
        <BoldSpan>⿹</BoldSpan>戈<BoldSpan>⿱</BoldSpan>口一), 貳 (
        <BoldSpan>⿹</BoldSpan>弋<BoldSpan>⿱</BoldSpan>二貝), and 戠 (
        <BoldSpan>⿹</BoldSpan>⿶戈<BoldSpan>⿱</BoldSpan>亠丷日).{" "}
        <BoldSpan>⿶</BoldSpan> alone matches 画 (⿱一
        <BoldSpan>⿶</BoldSpan>凵田).
      </SectionParagraph>

      <SectionParagraph darkMode={darkMode}>
        ❷ The number of occurrences of each unique component in a resulting
        character ≥ the number of times that component is entered in the input
        box, if turned on.
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        For instance, 人人人 matches 傘 (4x 人), 众 (3x 人), and 齒 (4x 人), and
        not 从 (2x 人), 纵 (2x 人), or 齿 (1x 人). 口土土 matches 哇 (1x 口, 2x
        土), and not 吐 (1x 口, 1x 土).
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        ❸ Turn this on if your device is unresponsive while searching. As of the
        time of writing, nearly 99,000 characters are indexed. For efficient
        retrieval, the data is organized as a directed graph, i.e.
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        人 ➞ 内 个 亥 亼 <span style={{ fontWeight: "bold" }}>从</span>
        ...
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        从 ➞ 丛 两 众 來 從...{" "}
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        Thus, a <span style={{ fontStyle: "italic" }}>complete</span> search
        algorithm must be used to transitively obtain all characters. In my
        brief tests;
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        一 (as can be expected) is likely the worst-case single-character query:
        ~54,500 results, with ~64800 edges (pairs of characters) traversed; ~300
        ms elapsed on a Snapdragon 425 phone. This process has to be repeated
        for each unique character entered.
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        一丨人 consumes ~500-600 ms, traversing around 116,500 edges.
      </SectionParagraph>
      <SectionParagraph darkMode={darkMode}>
        The search will be offloaded to a web worker if turned on, to avoid the
        fairly unlikely situation where the UI thread is blocked for a long
        time. Very few characters have normalized IDSes composed of more than 5
        or 6 unique characters, even in contrived situations such as U+291D2{" "}
        <LargeSpan>𩇒</LargeSpan>, the infamous <LargeSpan>鬱</LargeSpan>, or{" "}
        <span style={{ fontStyle: "italic" }}>biang</span>.
      </SectionParagraph>
      <div>
        <SectionTitle darkMode={darkMode}>Acknowledgements</SectionTitle>

        <SectionParagraph darkMode={darkMode}>
          The data used in this compiled version comes from:
        </SectionParagraph>

        <SectionParagraph darkMode={darkMode}>
          <Link
            target="_blank"
            to={{ pathname: "https://www.chise.org/ids/index.ja.html" }}
          >
            <FormattedMessage
              id="ack.chise_structural_info"
              defaultMessage="CHISE IDS Database"
            />
          </Link>{" "}
          - IDS strings, GPLv2 licensed
        </SectionParagraph>
        <SectionParagraph darkMode={darkMode}>
          <Link
            target="_blank"
            to={{ pathname: "http://kanji-database.sourceforge.net/" }}
          >
            <FormattedMessage
              id="ack.kanji_database_project"
              defaultMessage="Kanji Database Project"
            />
          </Link>{" "}
          - IDS strings (partially based on CHISE, thus GPLv2) and variants data
        </SectionParagraph>
        <SectionParagraph darkMode={darkMode}>
          <Link
            target="_blank"
            to={{
              pathname: "https://glyphwiki.org/wiki/GlyphWiki:MainPage",
            }}
          >
            GlyphWiki
          </Link>{" "}
          -{" "}
          <Link
            target="_blank"
            to={{
              pathname: "https://glyphwiki.org/wiki/GlyphWiki:License",
            }}
          >
            License
          </Link>
        </SectionParagraph>
      </div>
    </>
  );
};
