import React, { useEffect } from "react";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;



      
const Genre = ({ genre, setGenre, setPage, type, value, setValue }) => {
  const fetchGenre = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/genre/${type}/list?api_key=${API_KEY}&language=en-US`
    );
    const { genres } = await data.json();
    console.log(genres);

    const renamedGenres = genres.map(genre => {
      switch (genre.name) {
        case 'Animation':
          return { ...genre, name: 'Animation 🎨'};
        case 'Comedy':
          return {...genre, name: 'Comedy 🤣'};
        case 'Crime':
          return {...genre, name: 'Crime 🔪'};
        case 'Documentary':
          return {...genre, name: 'Documentary 🎥'};
        case 'Action':
          return {...genre, name: 'Action 💥'};
        case 'Adventure':
          return {...genre, name: 'Adventure 🏞️'};
        case 'Drama':
          return {...genre, name: 'Drama 🎭'};
        case 'Family':
          return {...genre, name: 'Family 👨‍👩‍👧‍👦'};
        case 'Fantasy':
          return {...genre, name: 'Fantasy 🧚'};
        case 'History':
          return {...genre, name: 'History 📜'};
        case 'Horror':
          return {...genre, name: 'Horror 👻'};
        case 'Music':
          return {...genre, name: 'Music 🎵'};
        case 'Mystery':
          return {...genre, name: 'Mystery 🕵️‍♂️'};
        case 'Romance':
          return {...genre, name: 'Romance ♥️'};
        case 'Science Fiction':
          return {...genre, name: 'Science Fiction 🛸'};
        case 'TV Movie':
          return {...genre, name: 'TV Movie 📺'};
        case 'Thriller':
          return {...genre, name: 'Thriller 😱'};
        case 'War':
          return {...genre, name: 'War ⚔️'};
        case 'Western':
          return {...genre, name: 'Western 🤠'};
          case 'Action & Adventure':
            return {...genre, name: 'Action & Adventure 💥🏞️'};
          case 'Kids':
            return {...genre, name: 'Kids 👶'};
          case 'News':
            return {...genre, name: 'News 📰'};
          case 'Reality':
            return {...genre, name: 'Reality 🎥'};
          case'Sci-Fi & Fantasy':
            return {...genre, name: 'Sci-Fi & Fantasy 🛸🧚'};
          case 'Soap':
            return {...genre, name: 'Soap🎶'};
          case 'Talk':
            return {...genre, name: 'Talk 🎤'};
          case 'War & Politics':
            return {...genre, name: 'War & Politics ⚔️🏛️'};
          default: 
        return genre; //if no match, return the genre name as is
      }
    });




    setGenre(renamedGenres);
  };

  useEffect(() => {
    fetchGenre();
  }, []);

  //Adding a particular genre to the selected array
  const CategoryAdd = (genres) => {
    //first - select everything that's inside of values using the spread operator
    //second - add those genres that are being sent from the non-selected arrays
    setValue([...value, genres]);
    //removing those genres from the non selected array that have been added to the selected array.
    setGenre(genre.filter((g) => g.id !== genres.id));
    setPage(1);
  };

  //removing a perticular genre from the selected array
  const CategoryRemove = (genres) => {
    setValue(value.filter((g) => g.id !== genres.id));
    setGenre([...genre, genres]);
    setPage(1);
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="genre col-12 d-flex flex-wrap">
            {value && //if value exist
              value.map((Val) => {
                const { id, name } = Val;
                return (
                  <>
                    <div className="m-2" key={id}>
                      <button
                        className="bg-dark text-white px-4 py-2 text-center buttons"
                        onClick={() => CategoryRemove(Val)}
                      >
                        {name}
                      </button>
                    </div>
                  </>
                );
              })}

            {genre && //if genre exist
              genre.map((Gen) => {
                const { id, name } = Gen;
                return (
                  <>
                    <div className="m-2" key={id}>
                      <button
                        className="bg-dark text-white px-4 py-2 text-center button"
                        onClick={() => CategoryAdd(Gen)}
                      >
                        {name}
                      </button>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Genre;
