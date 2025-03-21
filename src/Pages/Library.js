import React, { useContext } from "react";
import { LibraryContext } from "../Components/LibraryContext";
import { img_300, unavailable } from "../Components/config";

const Library = () => {
  const { library } = useContext(LibraryContext);

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
                    />
                    <div className="card-body">
                      <h5 className="card-title text-center fs-5">
                        {title || name}
                      </h5>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Library;