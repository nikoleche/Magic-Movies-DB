const { Router } = require("express");

const { isGuest, isUser } = require("../middlewares/guards");

const { home, details } = require("../controllers/catalog");
const { about } = require("../controllers/about");
const {
  createGET,
  createPost,
  editGET,
  editPOST,
  deleteGET,
  deletePOST,
} = require("../controllers/movie");
const {
  createGET: createCastGET,
  createPost: createCastPost,
} = require("../controllers/cast");
const { notFound } = require("../controllers/404");
const { search } = require("../controllers/catalog");
const { attachGET, attachPost } = require("../controllers/attach");
const {
  registerGET,
  registerPOST,
  loginGET,
  loginPOST,
  logout,
} = require("../controllers/user");

const router = Router();

router.get("/", home);
router.get("/search", search);
router.get("/about", about);

router.get("/details/:id", details);
router.get("/attach/:id", isUser(), attachGET);
router.post("/attach/:id", isUser(), attachPost);
router.get("/edit/:id", isUser(), editGET);
router.post("/edit/:id", isUser(), editPOST);
router.get("/delete/:id", isUser(), deleteGET);
router.post("/delete/:id", isUser(), deletePOST);

router.get("/create/movie", isUser(), createGET);
router.post("/create/movie", isUser(), createPost);
router.get("/create/cast", isUser(), createCastGET);
router.post("/create/cast", isUser(), createCastPost);

router.get("/register", isGuest(), registerGET);
router.post("/register", isGuest(), registerPOST);
router.get("/login", isGuest(), loginGET);
router.post("/login", isGuest(), loginPOST);
router.get("/logout", logout);

router.get("*", notFound);

module.exports = { router };
