import React from "react";
import Pagination from "react-paginating";

// results as a big long array or set..
interface ResultsPickerProps {
  queryResults: QueryResults;
}

const RADICALS_PER_ROW = 10;
const ROWS = 9;

const RESULTS_PER_PAGE = RADICALS_PER_ROW * ROWS;

const ResultsPicker = React.memo((props: ResultsPickerProps) => {
  const { queryResults } = props;

  let { res } = queryResults;
  if (!res) return null;

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

  return <div />;

  /* <Pagination
      className="bg-red"
      total={100}
      limit={limit}
      pageCount={pageCount}
      currentPage={currentPage}
    >
      {({
        pages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
        previousPage,
        nextPage,
        totalPages,
        getPageItemProps,
      }) => <div />}
    </Pagination> */
});

export default ResultsPicker;
