import React, { createContext, useState } from "react";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  const addToLibrary = (movie) => {
    setLibrary((prevLibrary) => {
      // Check if the movie already exists in the library
      if (prevLibrary.some((item) => item.id === movie.id)) {
        return prevLibrary; // Return the existing library if the movie is already added
      }
      return [...prevLibrary, movie]; // Add the movie if it doesn't exist in the library
    });
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};