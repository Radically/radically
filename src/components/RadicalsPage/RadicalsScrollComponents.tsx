import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useContext,
} from "react";
import { ListChildComponentProps } from "react-window";
import styled from "styled-components";
import { DataContext } from "../../contexts/DataContextProvider";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import IndividualRadicalCell from "../IndividualRadicalCell";

// import { withTheme } from "@material-ui/core/styles";
// import { SettingsContext } from "../../contexts/SettingsContextProvider";

export const outerElementType = forwardRef((props, ref: any) => (
  <div
    onKeyDown={(e) => {
      const { key } = e;
      if (key.startsWith("Arrow")) e.preventDefault();
    }}
    ref={ref}
    {...props}
  />
));

const HeaderRow = styled.div`
  font-size: 12pt;
  // padding-left: 5px;
  // padding-right: 5px;
  display: flex;
  align-items: center;
`;

const NormalRow = styled.div`
  font-size: 1.4em;
  // padding-left: 5px;
  // padding-right: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RadicalPickerRow = (props: ListChildComponentProps) => {
  // const { darkMode } = useContext(SettingsContext);
  const { index, style, data } = props;
  const { radicalsPerRow, arrayified, handleRadicalClick, selectedInfo } = data;

  const { darkMode } = useContext(SettingsContext);
  const { variantsLocales } = useContext(DataContext);

  if (arrayified[index].header) {
    return <HeaderRow style={style}>{arrayified[index].name}</HeaderRow>;
  }
  return (
    <NormalRow
      key={index}
      style={{
        ...style,
      }}
    >
      {arrayified[index].radicals.map((radical: string, col: number) => (
        <IndividualRadicalCell
          key={`radical-${index}-${col}`}
          darkMode={darkMode}
          selected={selectedInfo.index === index && selectedInfo.col === col}
          characterVariantLocales={variantsLocales[radical]?.l}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleRadicalClick(event, index, col, radical);
          }}
        >
          {radical}
        </IndividualRadicalCell>
      ))}

      {new Array(radicalsPerRow - arrayified[index].radicals.length)
        .fill(undefined)
        .map((x, col: number) => (
          <IndividualRadicalCell
            filler={true}
            key={`filler-${index}-${col}`}
            selected={false}
          />
        ))}
    </NormalRow>
  );
};
