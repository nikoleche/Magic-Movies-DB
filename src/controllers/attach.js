const { getMovieById, attachCastToMovie } = require("../services/movie");
const { getAllCast } = require("../services/cast");

module.exports = {
  attachGET: async (req, res) => {
    const id = req.params.id;
    const movie = await getMovieById(id);

    if (!movie) {
      return res.render("404");
    }

    const allCast = await getAllCast();
    const castInMovie = movie.cast.map((id) => id.toString());

    res.render("cast-attach", {
      movie,
      allCast: allCast.filter(
        (a) => !castInMovie.find((castId) => castId === a._id.toString())
      ),
    });
  },

  attachPost: async (req, res) => {
    const movieID = req.params.id;
    const castID = req.body.cast;

    if (!movieID || !castID) {
      res.status(400).end();
      return;
    }

    if (castID === "none") {
      const movie = await getMovieById(movieID);
      const allCast = await getAllCast();
      res.render("cast-attach", { movie, allCast, error: true });
      return;
    }

    try {
      await attachCastToMovie(movieID, castID);
    } catch (error) {
      console.error("Error adding cast to movie", error);
      res.status(400).end();
      return;
    }

    res.redirect("/details/" + movieID);
  },
};
