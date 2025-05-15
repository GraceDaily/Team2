import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { img_300, unavailable } from "./config";
import { LibraryContext } from "./LibraryContext";
import formatDate from "./formatDate";
import "../Pages/MovieSwipe.css";

const providerLinks = {
  "Netflix": "https://www.netflix.com",
  "Hulu": "https://www.hulu.com",
  "Amazon Prime Video": "https://www.primevideo.com",
  "Disney+": "https://www.disneyplus.com",
  "HBO Max": "https://www.hbomax.com",
  "AppleTV": "https://tv.apple.com",
  "Peacock": "https://www.peacocktv.com",
  "Paramount+": "https://www.paramountplus.com",
};

const MediaDetails = ({ show, handleClose, media }) => {
  const [runtime, setRuntime] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [streaming, setStreaming] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [addedToLibrary, setAddedToLibrary] = useState(null);
  const { addToLibrary } = useContext(LibraryContext);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const fetchRuntime = async () => {
    if (!media) return;
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}?api_key=${API_KEY}&language=en-US`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (type === "movie") {
        setRuntime(data.runtime ? `${data.runtime}m` : "N/A");
      } else if (type === "tv") {
        let avg = data.episode_run_time?.[0];
        if (!avg && data.last_episode_to_air?.runtime) {
            avg = data.last_episode_to_air.runtime;
        }
        setRuntime(avg ? `${avg}m/episode` : "N/A");
      }
  
      if (type === "movie") {
        const creditsUrl = `https://api.themoviedb.org/3/movie/${media.id}/credits?api_key=${API_KEY}&language=en-US`;
        const creditsRes = await fetch(creditsUrl);
        const creditsData = await creditsRes.json();
        const dir = creditsData.crew?.find((person) => person.job === "Director");
        setDirector(dir?.name || null);
      } else if (type === "tv") {
        const creators = data.created_by;
        setDirector(creators?.length ? creators.map((c) => c.name).join(", ") : null);
      }
    } catch (err) {
      console.error("Error fetching runtime or director/creator:", err);
      setRuntime("N/A");
      setDirector(null);
    }
  };

  const fetchCast = async () => {
    if (!media) return;
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}/credits?api_key=${API_KEY}&language=en-US`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCast(data.cast ? data.cast.slice(0, 4) : []);
    } catch (error) {
      console.error("Error fetching cast and director:", error);
      setCast([]);
    }
  };

  const fetchTrailer = async () => {
    if (!media) return;
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}/videos?api_key=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);
    } catch (err) {
      console.error("Error fetching trailer:", err);
      setTrailerKey(null);
    }
  };

  const fetchStreaming = async () => {
    if (!media) return;
    const type = media.media_type || "movie";
    const url = `https://api.themoviedb.org/3/${type}/${media.id}/watch/providers?api_key=${API_KEY}&language=en-US`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const providers = data.results?.US?.flatrate || [];
      const tmdbLink = data.results?.US?.link || "#";

      setStreaming(
        providers.map((provider) => ({
          ...provider,
          link: providerLinks[provider.provider_name] || tmdbLink,
        }))
      );
    } catch (error) {
      console.error("Error fetching streaming services:", error);
      setStreaming([]);
    }
  };

  const handleAddToLibrary = () => {
    if (!media) return;
    addToLibrary(media);
    setAddedToLibrary(media.id);
    setTimeout(() => setAddedToLibrary(null), 2000);
  };

  useEffect(() => {
    if (show && media) {
      fetchRuntime();
      fetchCast();
      fetchTrailer();
      fetchStreaming();
    }
  }, [show, media]);

  if (!media) return null;

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered className="media-details-modal">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{media.title || media.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <div className={`card d-flex flex-row bg-dark text-white mb-4`} style={{ width: "100%", overflow: "hidden" }}>
          <div className="d-flex flex-column align-items-center py-1 px-1">
            <img
              src={media.poster_path ? `${img_300}/${media.poster_path}` : unavailable}
              className="movieswipe-card-img-top pt-3 pb-3 px-3 py-3"
              style={{ objectFit: "cover" }}
              alt={media.title || media.name}
            />
            <div className="mt-2 text-center">
              <strong>Rating: {media.vote_average ? `${Math.ceil(media.vote_average)} / 10` : "N/A"}</strong>
            </div>
          </div>
          <div className="card-body d-flex flex-column">
            <div>
              <h5 className="card-title fs-2">{media.title || media.name}</h5>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <strong>{media.media_type === "tv" ? "TV Series" : "Movie"}</strong>
                <span>•</span>
                <strong>{formatDate(media.first_air_date || media.release_date)}</strong>
                {runtime && (
                  <>
                    <span>•</span>
                    <strong>{runtime}</strong>
                  </>
                )}
                {director && (
                  <>
                    <span>•</span>
                    <strong>{director}</strong>
                  </>
                )}
              </div>
              <div className="mt-3">
                <strong>Cast:</strong>
                {cast.length > 0 ? (
                  <ul className="mb-2">{cast.map((actor) => <li key={actor.id}>{actor.name}</li>)}</ul>
                ) : (
                  <p className="text-muted mb-2">No cast information available.</p>
                )}
              </div>
              <p className="mt-2 mb-3">
                <strong>Overview:</strong>{" "}
                <span className={media.overview ? "" : "text-muted"}>
                  {media.overview || "No overview available."}
                </span>
              </p>
            </div>
            <div className="mt-2 mb-3">
              <strong>Streaming:</strong>
              {streaming.length > 0 ? (
                <div className="flex flex-wrap gap-3 m-2 items-center">
                  {streaming.map((provider) => (
                    <a
                      key={provider.provider_name}
                      href={provider.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                        alt={provider.provider_name}
                        title={provider.provider_name}
                        className="h-6 w-6 object-contain mx-2"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-2">No streaming service information available.</p>
              )}
            </div>
            <div className="mt-auto">
              <strong>Trailer:</strong>
              {trailerKey ? (
                <div className="ratio ratio-16x9 mt-2">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="YouTube Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <p className="text-muted mt-2">No trailer available.</p>
              )}
              {addedToLibrary === media.id && (
                <div className="text-success mt-2">Added to Library</div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="primary" onClick={handleAddToLibrary}>
          Add to Library
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MediaDetails;