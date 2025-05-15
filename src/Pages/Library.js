import React, { useContext, useState } from "react";
import { LibraryContext } from "../Components/LibraryContext";
import { img_300, unavailable } from "../Components/config";
import MediaDetails from "../Components/MediaDetails";

const Library = () => {
  const { library, removeFromLibrary } = useContext(LibraryContext);
  const [selectedMedia, setSelectedMedia] = useState(null); // State for selected media
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Handler for poster click
  const handlePosterClick = (media) => {
    setSelectedMedia(media);
    setShowModal(true);
  };

  return (
    <>
      <div className="container">
        <div className="row py-5 my-5">
          <div className="col-12 mt-2 mb-4 fs-1 fw-bold text-decoration-underline head 
          d-flex justify-content-center align-items-center">
            Library
          </div>
          {library.length === 0 ? (
            <div className="col-12 text-center">No movies in the library.</div>
          ) : (
            library.map((movie) => {
              const { id, title, name, poster_path } = movie;
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
                      onClick={() => handlePosterClick(movie)} // Add click handler
                    />
                    <div className="card-body d-flex flex-column align-items-center">
                      <h5 className="card-title text-center fs-5">
                        {title || name}
                      </h5>
                      <button
                        className="btn btn-danger mt-2"
                        onClick={() => removeFromLibrary(id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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

export default Library;