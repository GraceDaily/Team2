import React, { useState, useEffect, useContext } from "react";
import { img_300, unavailable } from "../Components/config";
import Pagination from "../Components/Pagination";
import Genre from "../Components/Genre";
import useGenre from "../useGenre";
import { LibraryContext } from "../Components/LibraryContext";
import formatDate from "../Components/formatDate";
import MediaDetails from "../Components/MediaDetails";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Movies = () => {
  const [state, setState] = useState([]); //store the fetched data
  const [page, setPage] = useState(1); //keep a track of the page numbers
  const [genre, setGenre] = useState([]); //used to store the original genre values
  const [value, setValue] = useState([]); //used to store the selected genre values
  const [addedToLibrary, setAddedToLibrary] = useState(null); // State to manage the added message
  const genreURL = useGenre(value);
  const { addToLibrary } = useContext(LibraryContext); // Use the context
  const [selectedMedia, setSelectedMedia] = useState(null); // Add state for selected media
  const [showModal, setShowModal] = useState(false); // Add state for modal visibility

  

  useEffect(() => {

    const fetchTrending = async () => {
      const data = await fetch(`
      https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreURL}&with_original_language=en`);
      const dataJ = await data.json();
      setState(dataJ.results);
    };
    fetchTrending();
  }, [page, genreURL]);

  const handleAddToLibrary = (movie) => {
    addToLibrary(movie);
    setAddedToLibrary(movie.id); // Set the added movie ID
    setTimeout(() => setAddedToLibrary(null), 2000); // Clear the message after 2 seconds
  };

  // Add handler for poster click
  const handlePosterClick = (media) => {
    setSelectedMedia(media);
    setShowModal(true);
  };

  return (
    <>
      <div className="container">
        <div className="row py-5 my-5">
          <div className="col-12 text-center mt-2 mb-4 fs-1 fw-bold text-decoration-underline">
            Movies
          </div>
          <Genre
            genre={genre}
            setGenre={setGenre}
            setPage={setPage}
            type="movie"
            value={value}
            setValue={setValue}
          />
          {state.map((Val) => {
            const {
              name,
              title,
              poster_path,
              first_air_date,
              release_date,
              media_type,
              id,
            } = Val;
            return (
              <div className="col-md-3 col-sm-4 py-3" id="card" key={id}>
                <div className="card bg-dark">
                  <img
                    src={
                      poster_path ? `${img_300}/${poster_path}` : unavailable
                    }
                    className="card-img-top pt-3 pb-0 px-3"
                    alt={title || name}
                    style={{ cursor: "pointer" }} // Add pointer cursor
                    onClick={() => handlePosterClick(Val)} // Add click handler
                  />
                  <div className="card-body">
                    <h5 className="card-title text-center fs-5">
                      {title || name}
                    </h5>
                    <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                      <div>{media_type === "tv" ? "TV Series" : "Movie"}</div>
                      <div>{formatDate(first_air_date || release_date)}</div>
                    </div>
                    {/* Centered Button and Added Message */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToLibrary(Val)}
                      >
                        Add to Library
                      </button>
                      {addedToLibrary === id && (
                        <div className="text-success mt-2">Added to Library</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Pagination page={page} setPage={setPage} />
        </div>
      </div>
      <MediaDetails
        show={showModal}
        handleClose={() => setShowModal(false)}
        media={selectedMedia}
      />
    </>
  );
};

export default Movies;
