import React, { useState, useEffect, useContext, useCallback } from "react";
import { img_300, unavailable } from "../Components/config";
import Genre from "../Components/Genre";
import useGenre from "../useGenre";
import { LibraryContext } from "../Components/LibraryContext";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MovieSwpie = () => {
  const [state, setState] = useState([]);
  const [genre, setGenre] = useState([]); //used to store the original genre values
  const [addedToLibrary, setAddedToLibrary] = useState(null);
  const [value, setValue] = useState([]); //used to store the selected genre values

  const genreURL = useGenre(value);
  const { addToLibrary } = useContext(LibraryContext);

  const [randomIndex, setRandomIndex] = useState(null);

  // Fetch movies and set a random index when the component mounts
  const fetchTrending = useCallback(async () => {
    const data1 = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&include_adult=false&include_video=false&with_genres=${genreURL}`
    );
    const data2 = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&include_adult=false&include_video=false&with_genres=${genreURL}`
    );
    const dataJ = await data1.json();
    const dataK = await data2.json();
    const data = [...(dataJ.results || []), ...(dataK.results || [])];
    setState(data);
    // Set a random index when data is fetched
    if (data.length > 0) {
      setRandomIndex(Math.floor(Math.random() * (data.length-1)));
    }
  }, [genreURL]);

  // Fetch movies when the component mounts or genreURL changes
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending, genreURL]);

  // Shuffle to a new random movie
  const shuffleMovie = () => {
    if (state.length > 0) {
      setRandomIndex(Math.floor(Math.random() * (state.length-1)));
    }
  };

  const randomMovie = state[randomIndex];

  const handleAddToLibrary = (movie) => {
    addToLibrary(movie);
    setAddedToLibrary(movie.id); // Set the added movie ID
    setTimeout(() => setAddedToLibrary(null), 2000); // Clear the message after 2 seconds
  };

  return (
    <>
      <div className="container">
        <div className="row py-5 my-5">
          <div className="col-12 mt-2 mb-4 fs-1 fw-bold text-decoration-underline head d-flex justify-content-center align-items-center">
            MovieSwipe
          </div>
          <Genre
            genre={genre}
            setGenre={setGenre}
            type="movie"
            value={value}
            setValue={setValue}
          />
          <div className="col-12 mb-4 d-flex justify-content-center align-items-center gap-4">
            <button
              className="btn btn-primary mt-3"
              onClick={() => handleAddToLibrary(randomMovie)}
              disabled={!randomMovie} // Disable button if no movie is loaded
            >
              Add to Library
            </button>

            {randomMovie && (
              <div className="col-md-3 col-sm-4 py-3" id="card" key={randomMovie.id}>
                <div className="card bg-dark">
                  <img
                    src={
                      randomMovie.poster_path
                        ? `${img_300}/${randomMovie.poster_path}`
                        : unavailable
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
                    </div>
                    {/* "Added to Library" message */}
                    {addedToLibrary === randomMovie.id && (
                      <div className="text-success mt-2 text-center">Added to Library</div>
                    )}
                    {/* Display the overview (left-justified) */}
                    <p className="mt-3 px-3 text-start">
                      {randomMovie.overview || "No overview available."}
                    </p>
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