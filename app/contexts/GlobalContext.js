import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  return (
    <GlobalContext.Provider value={{ searchTerm, setSearchTerm, isSearching, setIsSearching, currentPage, setCurrentPage }}>
      {children}
    </GlobalContext.Provider>
  );
};
