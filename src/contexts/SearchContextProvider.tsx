import React, { useState } from "react";

const defaultValue = {
  searching: false,
  searchResults: null,
  performSearch: (unused: string, unused2: string) => {},
} as {
  searching: boolean;
  searchResults: string[] | null;
  performSearch: (unused: string, unused2: string) => void;
};

export const SearchContext = React.createContext(defaultValue);

export const SearchContextProvider = (props: { children: any }) => {
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const performSearch = (components: string, ids: string) => {
    
  };

  const context = {
    searchResults,
    searching,
    performSearch,
  };

  return <SearchContext.Provider value={context} {...props} />;
};
