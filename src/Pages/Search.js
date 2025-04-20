import React, { useState, useEffect, useContext, useCallback } from "react";
import Pagination from "../Components/Pagination";
import { img_300, unavailable } from "../Components/config";
import { LibraryContext } from "../Components/LibraryContext";
import formatDate from "../Components/formatDate";
import MediaDetails from "../Components/MediaDetails";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;



const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [content, setContent] = useState([]);
  const { addToLibrary } = useContext(LibraryContext); // Use the context
  const [addedToLibrary, setAddedToLibrary] = useState(null); // State to manage the added message
  const [selectedMedia, setSelectedMedia] = useState(null); // Add state for selected media
  const [showModal, setShowModal] = useState(false); // Add state for modal visibility

  const fetchSearch = useCallback(async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${searchText}&page=${page}&include_adult=false&with_original_language=en`
    );
    const { results } = await data.json();
    setContent(results);
  },[searchText,page]);

  useEffect(() => {
    fetchSearch();
  }, [fetchSearch]);

  const Search = () => {
    fetchSearch();
  };

  const Trigger = (e) => {
    setSearchText(e.target.value);
  };

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
        <div className="row pt-3 mb-5 pb-5">
          <div className="col-12 pt-5 pb-3 mt-5 d-flex justify-content-center align-items-center">
            <input
              type="text"
              placeholder="search..."
              onChange={Trigger}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  Search();
                }
              }}
              className="form-control-lg col-6 search bg-dark text-white border border-0"
              style={{ textTransform: "none" }}
            />
            <button
              className="btn btn-danger text-white mx-2 col-md-1 col-sm-2 py-2"
              onClick={Search}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
          {content &&
            content.map((Val) => {
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
                <>
                  <div className="col-md-3 col-sm-4 py-3" id="card" key={id}>
                    <div className="card bg-dark" key={id}>
                      <img
                        src={
                          poster_path
                            ? `${img_300}/${poster_path}`
                            : unavailable
                        }
                        alt={title}
                        style={{ cursor: "pointer" }} // Add pointer cursor
                        onClick={() => handlePosterClick(Val)} // Add click handler
                        className="card-img-top pt-3 pb-0 px-3"
                      />
                      <div className="card-body">
                        <h5 className="card-title text-center fs-5">
                          {title || name}
                        </h5>
                        <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                          <div>{media_type === "tv" ? "TV" : "Movie"}</div>
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
                </>
              );
            })}
          {page > 1 && <Pagination page={page} setPage={setPage} />}
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

export default Search;
