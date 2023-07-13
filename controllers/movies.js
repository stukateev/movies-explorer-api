const Movie = require('../models/movie');
const { handleError, FORBIDDEN } = require('../utils/errors');

const createMovie = (req, res, next) => {
  const {
    country, director, year, description,
    duration, image, trailerLink, thumbnail, nameRU, nameEN, movieId,
  } = req.body;
  const owner = req.user._id;
  return Movie.create({
    country,
    director,
    year,
    description,
    duration,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => handleError(err, next));
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.send(movie))
    .catch((err) => handleError(err, next));
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.findById(movieId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movieId)
          .orFail()
          .then((deletedMovie) => res.send(deletedMovie));
      } else {
        throw new FORBIDDEN();
      }
    })
    .catch((err) => handleError(err, next));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
