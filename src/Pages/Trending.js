import React, { useState, useEffect, useContext } from "react";
import { img_300, unavailable } from "../Components/config";
import Pagination from "../Components/Pagination";
import { LibraryContext } from "../Components/LibraryContext";
import Disclaimer from  "../Components/Disclaimer";
import formatDate from "../Components/formatDate";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Trending = () => {
  const [state, setState] = useState([]);
  const [page, setPage] = useState(1); // initialised the page state with the initial value of 1
  const { addToLibrary } = useContext(LibraryContext); // Use the context
  const [addedToLibrary, setAddedToLibrary] = useState(null); // State to manage the added message

  

  useEffect(() => {
    const fetchTrending = async () => {
      const data = await fetch(`
      https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&page=${page}&with_original_language=en`);
      const dataJ = await data.json();
      setState(dataJ.results);
    };
    fetchTrending();
  }, [page]);

  const handleAddToLibrary = (movie) => {
    addToLibrary(movie);
    setAddedToLibrary(movie.id); // Set the added movie ID
    setTimeout(() => setAddedToLibrary(null), 2000); // Clear the message after 2 seconds
  };

 
  return (
    <> 
      <div>
        <Disclaimer />
      </div>     
      <div className="container">
        <div className="row py-5 my-5">
          <div className="col-12 mt-2 mb-4 fs-1 fw-bold text-decoration-underline head d-flex justify-content-center align-items-center">
            Trending
          </div>
          
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
              <div
                key={id}
                className="col-md-3 col-sm-4 py-3 d-flex justify-content-center g-4"
                id="card"
              >
                <div className="card bg-dark">
                  <img
                    src={
                      poster_path ? `${img_300}/${poster_path}` : unavailable
                    }
                    className="card-img-top pt-3 pb-0 px-3"
                    alt={title}
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
            );
          })}
          <Pagination page={page} setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default Trending;
