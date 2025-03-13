import React, { useState, useEffect, useContext, useCallback } from "react";
import { img_300, unavailable } from "../Components/config";
import useGenre from "../useGenre";
import { LibraryContext } from "../Components/LibraryContext";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MovieSwpie = () => 
  {
  const [state, setState] = useState([]);
  const [addedToLibrary, setAddedToLibrary] = useState(null);
  const [value] = useState([]);

  const genreURL = useGenre(value);
  const { addToLibrary } = useContext(LibraryContext)

  const [randomIndex, setRandomIndex] = useState(null);
  
  const shuffleMovie = () => 
    {
    setRandomIndex(Math.floor(Math.random() * state.length));
    };
  
  const fetchTrending = useCallback(async () => 
    {
    const data = await fetch(`
    https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&include_adult=false&include_video=false&with_genres=${genreURL}`);
    const dataJ = await data.json();
    setState(dataJ.results);

    if (dataJ.results.length > 0) {
      setRandomIndex(Math.floor(Math.random() * dataJ.results.length));
    }
  }, [genreURL]);

  const randomMovie = state[randomIndex];

  useEffect(() => 
    {
      fetchTrending();
    }, [fetchTrending]);
  
    const handleAddToLibrary = (movie) => 
      {
      addToLibrary(movie);
      setAddedToLibrary(movie.id); // Set the added movie ID
      setTimeout(() => setAddedToLibrary(null), 2000); // Clear the message after 2 seconds
      };
   
    return (
        <>
          <div className="container">
            <div className="row py-5 my-5">
              <div className="col-12 mt-2 mb-4 fs-1 fw-bold text-decoration-underline head 
              d-flex justify-content-center align-items-center">
                MovieSwipe
              </div>

              <div className = "col-12 mb-4 d-flex justify-content-center align-items-center">
              <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleAddToLibrary(randomMovie)}
                    >
                      Add to Library
                    </button>
                    {randomMovie && (
              <div className="col-md-3 col-sm-4 py-3" id="card" key={randomMovie.id}>
                <div className="card bg-dark">
                  <img
                    src={
                      randomMovie.poster_path ? `${img_300}/${randomMovie.poster_path}` : unavailable
                    }
                    className="card-img-top pt-3 pb-0 px-3"
                    alt={randomMovie.title || randomMovie.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center fs-5">
                      {randomMovie.title || randomMovie.name}
                    </h5>
                    <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                      <div>{randomMovie.media_type === "tv" ? "TV Series" : "Movie"}</div>
                      <div>{randomMovie.first_air_date || randomMovie.release_date}</div>
                      {addedToLibrary === randomMovie.id && (
                      <div className="text-success mt-2">Added to Library</div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            
            )}
                    <button className="btn btn-primary mt-3" onClick={shuffleMovie}>
                Shuffle Movie
              </button>

              </div>
        </div>
      </div>
    </>
  );
};

export default MovieSwpie; 