import React, { createContext, useState, useEffect } from "react";

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState(() => {
    const savedLibrary = localStorage.getItem("library");
    return savedLibrary ? JSON.parse(savedLibrary) : [];
  });

  const [alreadyAdded, setAlreadyAdded] = useState(null); // State to manage the "Already added" message

  const addToLibrary = (movie) => {
    setLibrary((prevLibrary) => {
      // Check if the movie already exists in the library
      if (prevLibrary.some((item) => item.id === movie.id)) {
        setAlreadyAdded(movie.id); // Set the already added movie ID
        setTimeout(() => setAlreadyAdded(null), 2000); // Clear the message after 2 seconds
        return prevLibrary; // Return the existing library if the movie is already added
      }
      setAlreadyAdded(null); // Clear the already added message if the movie is not a duplicate
      return [...prevLibrary, movie]; // Add the movie if it doesn't exist in the library
    });
  };

  // Save library user data using localStorage
  useEffect(() => {
    localStorage.setItem("library", JSON.stringify(library));
  }, [library]);

  // Remove movies and tv shows from libary
  const removeFromLibrary = (movieId) => {
    setLibrary((prevLibrary) => prevLibrary.filter((item) => item.id !== movieId));
  };  

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, alreadyAdded }}>
      {children}
    </LibraryContext.Provider>
  );
};