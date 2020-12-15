import React from "react";
import Pagination from "react-paginating";

// results as a big long array or set..
interface ResultsPickerProps {
  queryResults: QueryResults;
}

const RADICALS_PER_ROW = 10;
const ROWS = 9;

const RESULTS_PER_PAGE = RADICALS_PER_ROW * ROWS;

const ResultsPicker = (props: ResultsPickerProps) => {
  const { queryResults } = props;

  let { res } = queryResults;
  if (!res) return null;

  const resArray = Array.from(res);

  // chunk into groups of RADICALS_PER_ROW * ROWS
  // [ [ [] ] ... ]

  const paginated: string[][] = [];

  let tempArray;
  for (let i = 0, j = resArray.length; i < j; i += RESULTS_PER_PAGE) {
    tempArray = resArray.slice(i, (i += RESULTS_PER_PAGE));
    paginated.push(tempArray);
  }

  console.log(paginated);

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
};

export default ResultsPicker;
