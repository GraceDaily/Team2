import React, { createContext, useState } from "react";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  const addToLibrary = (movie) => {
    setLibrary((prevLibrary) => [...prevLibrary, movie]);
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};