import React, { useState, useEffect, useContext, useCallback } from "react";
import { img_300, unavailable } from "../Components/config";
import Genre from "../Components/Genre";
import useGenre from "../useGenre";
import { LibraryContext } from "../Components/LibraryContext";
import formatDate from "../Components/formatDate";
import "./MovieSwipe.css";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const providerLinks = {
  "Netflix": "https://www.netflix.com",
  "Hulu": "https://www.hulu.com",
  "Amazon Prime Video": "https://www.primevideo.com",
  "Disney+": "https://www.disneyplus.com",
  "HBO Max": "https://www.hbomax.com",
  "AppleTV": "https://tv.apple.com",
  "Peacock": "https://www.peacocktv.com",
  "Paramount+": "https://www.paramountplus.com",
};

const MovieSwipe = () => {
  const [state, setState] = useState([]);
  const [genre, setGenre] = useState([]);
  const [value, setValue] = useState([]);
  const [addedToLibrary, setAddedToLibrary] = useState(null);
  const [runtime, setRuntime] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [streaming, setStreaming] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [randomIndex, setRandomIndex] = useState(null);
  const [displayedIndexes, setDisplayedIndex] = useState([]);
  const [animationDirection, setAnimationDirection] = useState(null);

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
      getData("movie", 1).then(results => results.map(item => ({ ...item, media_type: "movie" }))),
      getData("movie", 2).then(results => results.map(item => ({ ...item, media_type: "movie" }))),
      getData("movie", 3).then(results => results.map(item => ({ ...item, media_type: "movie" }))),
      getData("movie", 4).then(results => results.map(item => ({ ...item, media_type: "movie" }))),
      getData("movie", 5).then(results => results.map(item => ({ ...item, media_type: "movie" }))),
      getData("tv", 1).then(results => results.map(item => ({ ...item, media_type: "tv" }))),
      getData("tv", 2).then(results => results.map(item => ({ ...item, media_type: "tv" }))),
      getData("tv", 3).then(results => results.map(item => ({ ...item, media_type: "tv" }))),
      getData("tv", 4).then(results => results.map(item => ({ ...item, media_type: "tv" }))),
      getData("tv", 5).then(results => results.map(item => ({ ...item, media_type: "tv" })))
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

  const fetchRuntime = async (media) => {
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}?api_key=${API_KEY}&language=en-US`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (type === "movie") {
        setRuntime(data.runtime ? `${data.runtime}m` : "N/A");
      } else if (type === "tv") {
        let avg = data.episode_run_time?.[0];
        if (!avg && data.last_episode_to_air?.runtime) {
            avg = data.last_episode_to_air.runtime;
        }
        setRuntime(avg ? `${avg}m/episode` : "N/A");
      }
  
      if (type === "movie") {
        const creditsUrl = `https://api.themoviedb.org/3/movie/${media.id}
                            /credits?api_key=${API_KEY}&language=en-US`;
        const creditsRes = await fetch(creditsUrl);
        const creditsData = await creditsRes.json();
        const dir = creditsData.crew?.find((person) => person.job === "Director");
        setDirector(dir?.name || null);
      } else if (type === "tv") {
        const creators = data.created_by;
        setDirector(creators?.length ? creators.map((c) => c.name).join(", ") : null);
      }
    } catch (err) {
      console.error("Error fetching runtime or director/creator:", err);
      setRuntime("N/A");
      setDirector(null);
    }
  };

  const fetchCast = async (media) => {
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}/credits?api_key=${API_KEY}&language=en-US`;
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

  const fetchStreaming = async (media) => {
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}/watch/providers?api_key=${API_KEY}&language=en-US`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const providers = data.results?.US?.flatrate || [];
      const tmdbLink = data.results?.US?.link || "#"; // TMDB fallback link for the movie or TV show

      setStreaming(
        providers.map((provider) => ({
          ...provider,
          link: providerLinks[provider.provider_name] || tmdbLink, // Use mapped link or fallback to TMDB link
        }))
      );
    } catch (error) {
      console.error("Error fetching streaming services:", error);
      setStreaming([]);
    }
  };

  const shuffleMovie = (direction = "left") => {
    if (state.length === 0) return;

    setAnimationDirection(direction); // Set the animation direction

    const remaining = state.map((_, i) => i).filter((i) => !displayedIndexes.includes(i));
    if (remaining.length === 0) {
      setDisplayedIndex([]);
      shuffleMovie(direction);
      return;
    }

    setTimeout(() => {
      const index = remaining[Math.floor(Math.random() * remaining.length)];
      setRandomIndex(index);
      setDisplayedIndex((prev) => [...prev, index]);
      setAnimationDirection(null); // Reset the animation direction
    }, 500); // Match the animation duration
  };

  const handleAddToLibrary = (movie) => {
    addToLibrary(movie);
    setAddedToLibrary(movie.id);
    setTimeout(() => setAddedToLibrary(null), 2000);
    shuffleMovie("right"); // Swipe right for "Love it!"
  };

  const randomMovie = state[randomIndex];

  useEffect(() => {
    if (randomMovie) {
      fetchRuntime(randomMovie);
      fetchCast(randomMovie);
      fetchTrailer(randomMovie);
      fetchStreaming(randomMovie);
    }
  }, [randomMovie]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        shuffleMovie("left"); // Trigger "Hate it!" action
      } else if (event.key === "ArrowRight") {
        handleAddToLibrary(randomMovie); // Trigger "Love it!" action
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [randomMovie, shuffleMovie, handleAddToLibrary]);

  return (
    <div className="movieswipe">
      <div className="row py-5 my-5">
        <div className="col-12 mb-4 fs-1 fw-bold text-decoration-underline text-center">
          MovieSwipe
        </div>

        <Genre genre={genre} setGenre={setGenre} type="movie" value={value} setValue={setValue} />

        <div className="test col-12 d-flex justify-content-center align-items-center gap-4 flex-wrap">
          <button className="btn btn-primary mt-3 swipeButton" onClick={() => shuffleMovie("left")}>
            Hate it!
          </button>

          {randomMovie && (
            <div
              className={`card d-flex flex-row bg-dark text-white mb-4 ${
                animationDirection ? `swipe-animation swipe-${animationDirection}` : ""
              }`}
              style={{ width: "80%", overflow: "hidden" }}
            >
              <div className="d-flex flex-column align-items-center py-1 px-1">
                <img
                  src={randomMovie.poster_path ? `${img_300}/${randomMovie.poster_path}` : unavailable}
                  className="movieswipe-card-img-top pt-3 pb-3 px-3 py-3"
                  style={{objectFit: "cover" }}
                  alt={randomMovie.title || randomMovie.name}
                />
                <div className="mt-2 text-center">
                  <strong>Rating: {randomMovie.vote_average ? `${Math.ceil(randomMovie.vote_average)} / 10`  : "N/A"}</strong>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <div>
                  <h5 className="card-title fs-2">{randomMovie.title || randomMovie.name}</h5>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <strong>{randomMovie.media_type === "tv" ? "TV Series" : "Movie"}</strong>
                    <span>•</span>
                    <strong>{formatDate(randomMovie.first_air_date || randomMovie.release_date)}</strong>
                    {runtime && (
                    <>
                      <span>•</span>
                      <strong>{runtime}</strong>
                    </>
                    )}
                    {director && (
                    <>
                      <span>•</span>
                      <strong>{director}</strong>
                    </>
                    )}
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
                <div className="mt-2 mb-3">
                  <strong>Streaming:</strong>
                  {streaming.length > 0 ? (
                    <div className="flex flex-wrap gap-3 m-2 items-center">
                      {streaming.map((provider) => (
                        <a
                          key={provider.provider_name}
                          href={provider.link} // Use the mapped link or TMDB fallback link
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="h-6 w-6 object-contain mx-2"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-2">No streaming service information available.</p>
                  )}
                </div>
                <div className="mt-auto">
                  <strong>Trailer:</strong>
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
            className="btn btn-primary mt-3 swipeButton"
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
