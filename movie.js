const fs = require("fs/promises");
const { Movie } = require("../models/Movie");

const filePath = "./data/database.json";

async function readFile() {
  const movieData = await fs.readFile(filePath);
  return JSON.parse(movieData.toString());
}

async function writeFile(movieData) {
  await fs.writeFile(filePath, JSON.stringify(movieData));
}

function toMovieModel(movieData) {
  const movie = new Movie();

  movie.id = movieData.id;
  movie.title = movieData.title;
  movie.genre = movieData.genre;
  movie.director = movieData.director;
  movie.year = movieData.year;
  movie.imageURL = movieData.imageURL;
  movie.rating = movieData.rating;
  movie.description = movieData.description;

  return movie;
}

async function getAllMovies() {
  const movies = await readFile();
  return movies.map(toMovieModel);
}

async function getMovieById(id) {
  const movies = await readFile();

  const movie = movies.find((m) => m.id == id);

  return movie ? toMovieModel(movie) : movie;
}

async function createMovie(entryData) {
  const id = uuid();

  const newMovie = {
    id,
    title: entryData.title,
    genre: entryData.genre,
    director: entryData.director,
    year: Number(entryData.year),
    imageURL: entryData.imageURL,
    rating: Number(entryData.rating),
    description: entryData.description,
  };
  const movies = await readFile();
  movies.push(newMovie);
  await writeFile(movies);

  return toMovieModel(newMovie);
}

function uuid() {
  return "xxxx-xxxx".replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
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

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  searchAllMovies,
};
