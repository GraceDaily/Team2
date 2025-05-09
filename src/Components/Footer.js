import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const data = [
    {
      icon: "fas fa-fire-alt",
      name: "Trending",
      link: "/",
      id: 1,
    },
    {
      icon: "fas fa-film",
      name: "Movies",
      link: "/movies",
      id: 2,
    },
    {
      icon: "fas fa-tv",
      name: "TV Series",
      link: "/tv",
      id: 3,
    },
    {
      icon: "fa-solid fa-book-bookmark",
      name: "Library",
      link: "/library",
      id: 4,
    },
    {
      icon: "fa-solid fa-heart",
      name: "MovieSwipe",
      link: "/movieswipe",
      id: 5,
    },
    {
      icon: "fas fa-search",
      name: "Search",
      link: "/search",
      id: 6,
    },
    
  ];
  
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center bg-dark footer">
            {data.map((Val) => {
              return (
                <>
                  <NavLink to={`${Val.link}`}>
                    <button
                      className="footerButton col-sm-2 col-md-2 btn btn-dark"
                      key={Val.id}
                    >
                      <i className={`${Val.icon}`} id="fire"></i>
                      <br />
                      <h5 className="footerText pt-1 fs-6">{Val.name}</h5>
                    </button>
                  </NavLink>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
