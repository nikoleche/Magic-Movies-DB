const { Router } = require("express");
const { body, validationResult } = require("express-validator");

const { isUser } = require("../middlewares/guards");

const {
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../services/movie");
const { parseError } = require("../util");

const movieRouter = Router();

movieRouter.get("/create/movie", isUser(), (req, res) => {
  res.render("create");
});

movieRouter.post(
  "/create/movie",
  isUser(),
  body("imageURL").trim().isURL().withMessage("Please enter a valid URL"),
  async (req, res) => {
    const authorId = req.user._id;

    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }

      const result = await createMovie(req.body, authorId);
      res.redirect("/details/" + result._id);
    } catch (error) {
      res.render("create", {
        movie: req.body,
        errors: parseError(error).errors,
      });
    }
  }
);

movieRouter.get("/edit/:id", isUser(), async (req, res) => {
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
});

movieRouter.post("/edit/:id", isUser(), async (req, res) => {
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
});

movieRouter.get("/delete/:id", isUser(), async (req, res) => {
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
});

movieRouter.post("/delete/:id", isUser(), async (req, res) => {
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
});

module.exports = { movieRouter };
