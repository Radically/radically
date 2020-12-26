import React, { useEffect, useState } from "react";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";
import { useWindowDimensions } from "../../utils";
import UltimatePagination from "../UltimatePagination";
import CharacterResult from "./CharacterResult";

import { INDIVIDUAL_RADICAL_WIDTH_PX, RADICALS_PER_ROW } from "./Constants";

// results as a big long array or set..
interface ResultsPickerProps {
  onResultSelected: (radical: string) => void;
  queryResults: QueryResults;
  readings: Readings;
}

const ROWS = 10;

const RESULTS_PER_PAGE = RADICALS_PER_ROW * ROWS;

const IndividualRadicalCell = styled("div")<{
  selected: boolean;
}>`
  width: ${INDIVIDUAL_RADICAL_WIDTH_PX}px;
  height: ${INDIVIDUAL_RADICAL_WIDTH_PX}px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#2185d0" : "none")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 5px;
  // padding: 15px;
  cursor: pointer;
`;

const PageRow = (props: {
  index: number;
  data: string[];
  selectedInfo: ResultsSelectedInfo;
}) => {
  const { index, data, selectedInfo } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "20pt",
        // fontWeight: "bold",
        // width: "350px",
      }}
    >
      {data.map((char, col) => (
        <CharClickContext.Consumer>
          {(handleRadicalClick) => {
            return (
              <IndividualRadicalCell
                onClick={() => {
                  handleRadicalClick(index, col, char);
                }}
                selected={
                  index === selectedInfo.index && col === selectedInfo.col
                }
              >
                {char}
              </IndividualRadicalCell>
            );
          }}
        </CharClickContext.Consumer>
      ))}

      {new Array(RADICALS_PER_ROW - data.length).fill(undefined).map((x) => (
        <IndividualRadicalCell selected={false} />
      ))}
    </div>
  );
};

interface ResultsSelectedInfo {
  index: number;
  col: number;
  char: string;
}

export const CharClickContext = React.createContext(
  (index: number, col: number, char: string) => {}
);

const ResultsPicker = React.memo((props: ResultsPickerProps) => {
  const { width, height } = useWindowDimensions();

  const { queryResults, readings, onResultSelected } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInfo, setSelectedInfo] = useState({} as ResultsSelectedInfo);

  // if the query results changes, clear the selected info
  useEffect(() => {
    setSelectedInfo({} as ResultsSelectedInfo);
    setCurrentPage(1);
  }, [queryResults]);

  const charSelected = "index" in selectedInfo && "col" in selectedInfo;

  let { res } = queryResults;
  if (!res) return null;

  if (!res.size) {
    return (
      <Segment style={{ textAlign: "center", fontSize: "15pt" }}>
        No Results
      </Segment>
    );
  }

  const resArray = Array.from(res);

  // chunk into groups of RADICALS_PER_ROW * ROWS
  // [ [ [] ] ... ]

  const paginated: string[][] = [];

  let tempArray;
  for (let i = 0, j = resArray.length; i < j; i += RESULTS_PER_PAGE) {
    tempArray = resArray.slice(i, i + RESULTS_PER_PAGE);
    paginated.push(tempArray);
  }

  const paginatedRowified: string[][][] = [];

  for (let k = 0; k < paginated.length; k++) {
    const page = paginated[k];
    const rowified: string[][] = [];
    // tempArray variable reuse
    for (let i = 0, j = page.length; i < j; i += RADICALS_PER_ROW) {
      tempArray = page.slice(i, i + RADICALS_PER_ROW);
      rowified.push(tempArray);
    }
    paginatedRowified.push(rowified);
  }

  const handlePageChange = (page: number | undefined) => {
    console.log(page);
    if (page) setCurrentPage(page);
  };

  const currentPageData = paginatedRowified[currentPage - 1];

  const handleRadicalClick = (index: number, col: number, char: string) => {
    if (selectedInfo.index === index && selectedInfo.col === col)
      onResultSelected(char);
    setSelectedInfo({ index, col, char });
  };

  const siblingPagesRange = width!! > 991 ? 1 : 0;
  const boundaryPagesRange = width!! > 991 ? 1 : 0;
  const hideEllipsis = !(width!! > 991);

  return (
    <>
      {/* info on the selected character */}

      <CharClickContext.Provider value={handleRadicalClick}>
        <Segment>
          {charSelected && (
            <CharacterResult char={selectedInfo.char} readings={readings} />
          )}
          {currentPageData?.map((row, index) => (
            <PageRow index={index} data={row} selectedInfo={selectedInfo} />
          ))}
        </Segment>
      </CharClickContext.Provider>
      <UltimatePagination
        currentPage={Math.min(currentPage, paginatedRowified.length)}
        totalPages={paginatedRowified.length}
        siblingPagesRange={siblingPagesRange}
        boundaryPagesRange={boundaryPagesRange}
        hideEllipsis={hideEllipsis}
        onChange={handlePageChange}
      />
    </>
  );
});

export default ResultsPicker;
