import React, { useState, useEffect, useContext, useCallback } from "react";
import { img_300, unavailable } from "../Components/config";
import Genre from "../Components/Genre";
import useGenre from "../useGenre";
import { LibraryContext } from "../Components/LibraryContext";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MovieSwipe = () => {
  const [state, setState] = useState([]);
  const [genre, setGenre] = useState([]);
  const [value, setValue] = useState([]);
  const [addedToLibrary, setAddedToLibrary] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [randomIndex, setRandomIndex] = useState(null);
  const [displayedIndexes, setDisplayedIndex] = useState([]);

  const genreURL = useGenre(value);
  const { addToLibrary } = useContext(LibraryContext);

  const fetchTrending = useCallback(async () => {
    const getData = async (type, page = 1) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreURL}&with_original_language=en`
      );
      const dataJ = await response.json();
      return dataJ.results || [];
    };

    const data = await Promise.all([
      getData("movie", 1), getData("movie", 2),
      getData("movie", 3), getData("movie", 4),
      getData("movie", 5), getData("tv", 1),
      getData("tv", 2), getData("tv", 3),
      getData("tv", 4), getData("tv", 5)
    ]);

    const mediaData = data.flat();
    setState(mediaData);
    setDisplayedIndex([]);

    if (mediaData.length > 0) {
      const index = Math.floor(Math.random() * mediaData.length);
      setRandomIndex(index);
      setDisplayedIndex([index]);
    }
  }, [genreURL]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending, genreURL]);

  const fetchCast = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCast(data.cast ? data.cast.slice(0, 4) : []);
    } catch (error) {
      console.error("Error fetching cast:", error);
      setCast([]);
    }
  };

  const fetchTrailer = async (media) => {
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}/videos?api_key=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setTrailerKey(null);
    }
  };

  const shuffleMovie = () => {
    if (state.length === 0) return;

    const remaining = state.map((_, i) => i).filter((i) => !displayedIndexes.includes(i));
    if (remaining.length === 0) {
      setDisplayedIndex([]);
      shuffleMovie();
      return;
    }

    const index = remaining[Math.floor(Math.random() * remaining.length)];
    setRandomIndex(index);
    setDisplayedIndex((prev) => [...prev, index]);
  };

  const handleAddToLibrary = (movie) => {
    addToLibrary(movie);
    setAddedToLibrary(movie.id);
    setTimeout(() => setAddedToLibrary(null), 2000);
    shuffleMovie();
  };

  const randomMovie = state[randomIndex];

  useEffect(() => {
    if (randomMovie) {
      fetchCast(randomMovie.id);
      fetchTrailer(randomMovie);
    }
  }, [randomMovie]);

  return (
    <div className="container">
      <div className="row py-5 my-5">
        <div className="col-12 mb-4 fs-1 fw-bold text-decoration-underline text-center">
          MovieSwipe
        </div>

        <Genre genre={genre} setGenre={setGenre} type="movie" value={value} setValue={setValue} />

        <div className="col-12 d-flex justify-content-center align-items-center gap-4 flex-wrap">
          <button className="btn btn-primary mt-3" onClick={shuffleMovie}>
            Hate it!
          </button>

          {randomMovie && (
            <div className="card d-flex flex-row bg-dark text-white mb-4" style={{ width: "80%", overflow: "hidden" }}>
              <div className="d-flex flex-column align-items-center py-1 px-1">
                <img
                  src={randomMovie.poster_path ? `${img_300}/${randomMovie.poster_path}` : unavailable}
                  className="card-img-top pt-3 pb-3 px-3 py-3"
                  style={{ width: "250px", objectFit: "cover" }}
                  alt={randomMovie.title || randomMovie.name}
                />
                <div className="mt-2 text-center">
                  <strong>Rating: {randomMovie.vote_average ? `${Math.ceil(randomMovie.vote_average)} / 10`  : "N/A"}</strong>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <div>
                  <h5 className="card-title fs-2">{randomMovie.title || randomMovie.name}</h5>
                  <div className="d-flex justify-content-between">
                    <strong>{randomMovie.media_type === "tv" ? "TV Series" : "Movie"}</strong>
                    <strong>{randomMovie.first_air_date || randomMovie.release_date}</strong>
                  </div>
                  <div className="mt-3">
                    <strong>Cast:</strong>
                    {cast.length > 0 ? (
                      <ul className="mb-2">{cast.map((actor) => <li key={actor.id}>{actor.name}</li>)}</ul>
                    ) : (
                      <p className="text-muted mb-2">No cast information available.</p>
                    )}
                  </div>
                  <p className="mt-2 mb-3">
                    <strong>Overview:</strong>{" "}
                    <span className={randomMovie.overview ? "" : "text-muted"}>
                      {randomMovie.overview || "No overview available."}
                    </span>
                  </p>
                </div>
                <div className="mt-auto">
                  <strong>Trailer</strong>
                  {trailerKey ? (
                    <div className="ratio ratio-16x9 mt-2">
                      <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}`}
                        title="YouTube Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <p className="text-muted mt-2">No trailer available.</p>
                  )}
                  {addedToLibrary === randomMovie.id && (
                    <div className="text-success mt-2">Added to Library</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary mt-3"
            onClick={() => handleAddToLibrary(randomMovie)}
            disabled={!randomMovie}
          >
            Love it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieSwipe;
