import React, { useState } from "react";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";
import UltimatePagination from "../UltimatePagination";

// results as a big long array or set..
interface ResultsPickerProps {
  queryResults: QueryResults;
}

const RADICALS_PER_ROW = 10;
const ROWS = 10;

const RESULTS_PER_PAGE = RADICALS_PER_ROW * ROWS;

const IndividualRadicalCell = styled("div")<{
  selected: boolean;
}>`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#2185d0" : "none")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 5px;
  // padding: 15px;
  cursor: pointer;
`;

const PageRow = (props: { data: string[] }) => {
  const { data } = props;
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
      {data.map((char) => (
        <IndividualRadicalCell selected={false}>{char}</IndividualRadicalCell>
      ))}
    </div>
  );
};

const ResultsPicker = React.memo((props: ResultsPickerProps) => {
  const { queryResults } = props;

  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <>
      <Segment>
        {currentPageData?.map((row) => (
          <PageRow data={row} />
        ))}
      </Segment>
      <UltimatePagination
        currentPage={currentPage}
        totalPages={paginatedRowified.length}
        // siblingPagesRange={3}
        onChange={handlePageChange}
      />
    </>
  );
});

export default ResultsPicker;
