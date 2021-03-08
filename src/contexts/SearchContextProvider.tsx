import React, { useContext, useState } from "react";
import { filterUsingIDCs, performComponentQuery } from "../searchalgo";
import { DataContext } from "./DataContextProvider";
import SearchWorker from "../searchworker";
import { SharedTextboxContext } from "./SharedTextboxContextProvider";
import { SelectedInfo } from "../types/common";

import { ScrollOffsets } from "../GlobalVariables";

const defaultValue = {
  searching: false,
  searchResults: [],
  performSearch: async (
    components: string,
    idcs: string,
    atLeastComponentFreq: boolean,
    useWebWorker: boolean
  ) => false,
} as {
  searching: boolean;
  searchResults: string[];
  performSearch: (
    components: string,
    idcs: string,
    atLeastComponentFreq: boolean,
    useWebWorker: boolean
  ) => Promise<boolean>;
};

export const SearchContext = React.createContext(defaultValue);

const searchWorkerInstance = new SearchWorker();

export const SearchContextProvider = (props: { children: any }) => {
  const [searching, setSearching] = useState(false);
  const [searchResults, _setSearchResults] = useState([] as string[]);

  const { setResultsSelectedInfo /* setResultsScrollPosition */ } = useContext(
    SharedTextboxContext
  );

  const setSearchResults = (searchResults: string[]) => {
    setResultsSelectedInfo({} as SelectedInfo);
    // setResultsScrollPosition(0);
    ScrollOffsets.resultsPage = 0;
    _setSearchResults(searchResults);
  };

  const {
    forwardMap,
    forwardMapLoading,

    reverseMapCharFreqsOnly,
    reverseMapCharFreqsOnlyLoading,

    reverseMapIDSOnly,
    reverseMapIDSOnlyLoading,
  } = useContext(DataContext);

  const performSearch = async (
    components: string,
    idcs: string,
    atLeastComponentFreq: boolean,
    useWebWorker: boolean = false
  ) => {
    setSearching(true);
    const pcq = useWebWorker
      ? searchWorkerInstance.performComponentQuery
      : performComponentQuery;
    const fidcs = useWebWorker
      ? searchWorkerInstance.filterUsingIDCs
      : filterUsingIDCs;

    let s = Array.from(
      await pcq(
        forwardMap,
        reverseMapCharFreqsOnly,
        components,
        atLeastComponentFreq
      )
    );

    if (!idcs) {
      // return s;
      setSearching(false);
      setSearchResults(s);
      return !!s.length;
    }
    // no need to return (?) or status only
    s = await fidcs(reverseMapIDSOnly, s, idcs);
    setSearching(false);
    setSearchResults(s);
    // return s;
    return !!s.length;
  };

  const context = {
    searchResults,
    searching,
    performSearch,
  };

  return <SearchContext.Provider value={context} {...props} />;
};
