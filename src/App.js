import React from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trending from "./Pages/Trending";
import Movies from "./Pages/Movies";
import TV from "./Pages/TV";
import Library from "./Pages/Library";
import MovieSwpie from "./Pages/MovieSwpie";
import Search from "./Pages/Search";
import Error from "./Pages/Error";
import Disclaimer from "./Components/Disclaimer";
const App = () => {
  return (
    <>
      <Disclaimer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Trending />} exact />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/library" element={<Library />} />
          <Route path="/movieswipe" element={<MovieSwpie />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
