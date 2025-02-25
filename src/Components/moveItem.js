import React from 'react';

const MovieItem = ({ movie, addToLibrary }) => {
  return (
    <div className="movie-item">
      <h3>{movie.title}</h3>
      <p>{movie.description}</p>
      <button onClick={() => addToLibrary(movie)}>Add to Library</button>
    </div>
  );
};

export default MovieItem;