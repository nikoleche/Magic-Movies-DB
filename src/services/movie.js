const { Movie } = require("../models/Movie");

async function getAllMovies() {
  const movies = await Movie.find().lean();
  return movies;
}

async function getMovieById(id) {
  const movies = await Movie.findById(id).lean().populate("cast");
  return movies;
}

async function createMovie(entryData, authorId) {
  const newMovie = new Movie({
    title: entryData.title,
    genre: entryData.genre,
    director: entryData.director,
    year: Number(entryData.year),
    imageURL: entryData.imageURL,
    rating: Number(entryData.rating),
    description: entryData.description,
    author: authorId,
  });
  await newMovie.save();
  return newMovie;
}

async function searchAllMovies(title, genre, year) {
  const allMovies = await getAllMovies();
  const moviesMatched = [];

  for (const movie of allMovies) {
    if (
      movie.title.toLowerCase().includes(title.toLowerCase()) &&
      movie.genre.toLowerCase().includes(genre.toLowerCase()) &&
      movie.year.toString().includes(year.toString())
    ) {
      moviesMatched.push(movie);
    }
  }
  return moviesMatched;
}

async function updateMovie(movieID, movieData, userID) {
  const movie = await Movie.findById(movieID);

  if (!movie) {
    throw new Error(`Movie ${movieID} not found`);
  }

  if (movie.author.toString() !== userID) {
    throw new Error("Access denied");
  }

  movie.title = movieData.title;
  movie.genre = movieData.genre;
  movie.director = movieData.director;
  movie.year = Number(movieData.year);
  movie.imageURL = movieData.imageURL;
  movie.rating = Number(movieData.rating);
  movie.description = movieData.description;

  await movie.save();

  return movie;
}

async function deleteMovie(movieID, movieData, userID) {
  const movie = await Movie.findById(movieID);

  if (!movie) {
    throw new Error(`Movie ${movieID} not found`);
  }

  if (movie.author.toString() !== userID) {
    throw new Error("Access denied");
  }

  await Movie.findByIdAndDelete(movieID);
}

async function attachCastToMovie(movieID, castID, userID) {
  const movie = await Movie.findById(movieID);

  if (!movie) {
    throw new Error(`Movie ${movieID} not found`);
  }

  if (movie.author.toString() !== userID) {
    throw new Error("Access denied");
  }

  movie.cast.push(castID);

  await movie.save();

  return movie;
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  searchAllMovies,
  attachCastToMovie,
  updateMovie,
  deleteMovie,
};
