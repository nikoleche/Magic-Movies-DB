const { isUser } = require("../middlewares/guards");
const { home, details } = require("../controllers/catalog");
const { about } = require("../controllers/about");
const { movieRouter } = require("../controllers/movie");
const {
  createGET: createCastGET,
  createPost: createCastPost,
} = require("../controllers/cast");
const { notFound } = require("../controllers/404");
const { search } = require("../controllers/catalog");
const { attachGET, attachPost } = require("../controllers/attach");
const { userRouter } = require("../controllers/user");

function configRoutes(app) {
  app.get("/", home);
  app.get("/search", search);
  app.get("/details/:id", details);

  app.get("/attach/:id", isUser(), attachGET);
  app.post("/attach/:id", isUser(), attachPost);

  app.use(movieRouter);

  app.get("/create/cast", isUser(), createCastGET);
  app.post("/create/cast", isUser(), createCastPost);

  app.use(userRouter);

  app.get("/about", about);
  app.get("*", notFound);
}

module.exports = { configRoutes };
