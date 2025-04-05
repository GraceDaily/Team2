import React, { useState, useEffect, useContext, useCallback } from "react";
import { img_300, unavailable } from "../Components/config";
import Genre from "../Components/Genre";
import useGenre from "../useGenre";
import { LibraryContext } from "../Components/LibraryContext";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MovieSwpie = () => {
  const [state, setState] = useState([]);
  //const [page, setPage] = useState(1); //keep a track of the page numbers
  const [genre, setGenre] = useState([]); //used to store the original genre values
  const [addedToLibrary, setAddedToLibrary] = useState(null);
  const [value, setValue] = useState([]); //used to store the selected genre values

  const genreURL = useGenre(value);
  const { addToLibrary } = useContext(LibraryContext);

  //used to get a random movie
  const [randomIndex, setRandomIndex] = useState(null);
  //used to make sure that once a user has been suggested a movie they will not be suggested it again
  const [displayedIndexes, setDisplayedIndex] = useState([]);

  // Fetch movies and set a random index when the component mounts
  const fetchTrending = useCallback(async () => {
    const getData = async(type, page = 1) => {
    const data = await fetch(`
      https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreURL}`);
      const dataJ = await data.json();
      return dataJ.results || []; 
    };

    //need to load in multiple pages of data so there are many suggestion to pull from
    const [movie1, movie2, movie3, movie4, movie5, tv1,tv2,tv3,tv4,tv5] = await Promise.all ([
      getData("movie",1),
      getData("movie",2),
      getData("movie",3),
      getData("movie",4),
      getData("movie",5),
      getData("tv",1),
      getData("tv",2),
      getData("tv",3),
      getData("tv",4),
      getData("tv",5),
    ]);
    const mediaData = [...movie1,...movie2,...movie3,...movie4,...movie5,...tv1,...tv2,...tv3,...tv4,...tv5];
    setState(mediaData);
    setDisplayedIndex([]);

    // Set first random index when data is fetched
    if (mediaData.length > 0) {
      const index1 = (Math.floor(Math.random() * (mediaData.length)));
      setRandomIndex(index1);
      setDisplayedIndex([index1]);
    }
  }, [genreURL]);

  // Fetch movies when the component mounts or genreURL changes
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending, genreURL]);

  // Shuffle to a new random movie
  const shuffleMovie = () => {
    if (state.length === 0) 
      return;
      //all the indexes that have not been displayed already
      const remainingIndexes = state
      .map((_, i) => i)
      .filter(i => !displayedIndexes.includes(i));
      //if everything has already been displayed, clear the array and restart
      if (remainingIndexes.length === 0)
      {
        setDisplayedIndex([]);
        shuffleMovie();
        return;
      }
      //since we still have fresh suggestions, suggest one of those. 
      const index = remainingIndexes[Math.floor(Math.random() * (remainingIndexes.length))];
      setRandomIndex(index);
      setDisplayedIndex(prev => [...prev, index]);
  };
  //the random suggestion
  const randomMovie = state[randomIndex];
  //add to library function
  const handleAddToLibrary = (movie) => {
    addToLibrary(movie);
    setAddedToLibrary(movie.id); // Set the added movie ID
    setTimeout(() => setAddedToLibrary(null), 2000); // Clear the message after 2 seconds
    shuffleMovie();
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
            //setPage={setPage}
            setGenre={setGenre}
            type="movie"
            value={value}
            setValue={setValue}
          />
          <div className="col-12 mb-4 d-flex justify-content-center align-items-center gap-4">
          <button className="btn btn-primary mt-3" onClick={shuffleMovie}>
             Hate it!
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
            <button
            className="btn btn-primary mt-3"
              onClick={() => handleAddToLibrary(randomMovie)}
              disabled={!randomMovie} // Disable button if no movie is loaded
            >
              Love it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieSwpie;