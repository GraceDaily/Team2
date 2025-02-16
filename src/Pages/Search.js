import React, { useState, useEffect } from "react";
import Pagination from "../Components/Pagination";
import { img_300, unavailable } from "../Components/config";
import Genre from "../Components/Genre";
import useGenre from "../useGenre";

const Search = () => {
  const [state, setState] = useState([]); //store the fetched data
  const [page, setPage] = useState(1); //keep a track of the page numbers
  const [genre, setGenre] = useState([]); //used to store the origional genre values
  const [value, setValue] = useState([]); //used to store the selected genre values
  const genreURL = useGenre(value);

  const fetchTrending = async () => {
    const data = await fetch(`
    https://api.themoviedb.org/3/discover/movie?api_key=7d5c6dc341e5626ee3c5ab2d8d62ad77&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreURL}`);
    const dataJ = await data.json();
    setState(dataJ.results);
  };

  useEffect(() => {
    fetchTrending();
  }, [page, genreURL]);

  const [searchText, setSearchText] = useState("");
  const [content, setContent] = useState([]);

  const fetchSearch = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=7d5c6dc341e5626ee3c5ab2d8d62ad77&language=en-US&query=${searchText}&page=${page}&include_adult=false`
    );
    const { results } = await data.json();
    setContent(results);
  };

  useEffect(() => {
    fetchSearch();
  }, []);

  const Search = () => {
    fetchSearch();
  };

  const Trigger = (e) => {
    setSearchText(e.target.value);
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
              className="form-control-lg col-6 search bg-dark text-white border border-0"
            />
            <button
              className="btn btn-danger text-white mx-2 col-md-1 col-sm-2 py-2"
              onClick={Search}
            >
              <i className="fas fa-search"></i>
            </button>
            <Genre
            genre={genre}
            setGenre={setGenre}
            setPage={setPage}
            type="movie"
            value={value}
            setValue={setValue}
          />
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
                        className="card-img-top pt-3 pb-0 px-3"
                      />
                      <div className="card-body">
                        <h5 className="card-title text-center fs-5">
                          {title || name}
                        </h5>
                        <div className="d-flex fs-6 align-items-center justify-content-evenly movie">
                          <div>{media_type === "tv" ? "TV" : "Movie"}</div>
                          <div>{first_air_date || release_date}</div>
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
    </>
  );
};

export default Search;
