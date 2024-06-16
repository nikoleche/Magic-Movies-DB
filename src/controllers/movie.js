const {
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../services/movie");

module.exports = {
  createGET: (req, res) => {
    res.render("create");
  },
  createPost: async (req, res) => {
    const authorId = req.user._id;

    const errors = {
      title: !req.body.title,
      genre: !req.body.genre,
      director: !req.body.director,
      year: !req.body.year,
      imageURL: !req.body.imageURL,
      rating: !req.body.rating,
      description: !req.body.description,
    };

    if (Object.values(errors).includes(true)) {
      res.render("create", { movie: req.body, errors });
      return;
    }

    const result = await createMovie(req.body, authorId);
    res.redirect("/details/" + result._id);
  },
  editGET: async (req, res) => {
    const movieId = req.params.id;
    let movie;

    try {
      movie = await getMovieById(movieId);

      if (!movie) {
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.render("404");
      return;
    }

    if (!movie) {
      res.render("404");
      return;
    }

    const isAuthor = req.user._id === movie.author.toString();

    if (!isAuthor) {
      res.redirect("/login");
      return;
    }

    res.render("edit", { movie });
  },
  editPOST: async (req, res) => {
    const movieId = req.params.id;
    const authorId = req.user._id;

    const errors = {
      title: !req.body.title,
      genre: !req.body.genre,
      director: !req.body.director,
      year: !req.body.year,
      imageURL: !req.body.imageURL,
      rating: !req.body.rating,
      description: !req.body.description,
    };

    if (Object.values(errors).includes(true)) {
      res.render("edit", { movie: req.body, errors });
      return;
    }

    try {
      await updateMovie(movieId, req.body, authorId);
    } catch (error) {
      if (error.message === "Access denied") {
        res.redirect("/login");
      } else {
        res.render("404");
      }
      return;
    }

    res.redirect("/details/" + movieId);
  },
  deleteGET: async (req, res) => {
    const movieId = req.params.id;
    let movie;

    try {
      movie = await getMovieById(movieId);

      if (!movie) {
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.render("404");
      return;
    }

    if (!movie) {
      res.render("404");
      return;
    }

    const isAuthor = req.user._id === movie.author.toString();

    if (!isAuthor) {
      res.redirect("/login");
      return;
    }

    res.render("delete", { movie });
  },
  deletePOST: async (req, res) => {
    const movieId = req.params.id;
    const authorId = req.user._id;

    try {
      await deleteMovie(movieId, req.body, authorId);
    } catch (error) {
      if (error.message === "Access denied") {
        res.redirect("/login");
      } else {
        res.render("404");
      }
      return;
    }

    res.redirect("/");
  },
};
