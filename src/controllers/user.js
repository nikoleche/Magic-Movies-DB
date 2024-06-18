const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const { isGuest } = require("../middlewares/guards");
const { generateToken } = require("../services/token");
const { register, login } = require("../services/userService");
const { parseError } = require("../util");

const userRouter = Router();

userRouter.get("/register", isGuest(), (req, res) => {
  res.render("register");
});

userRouter.post(
  "/register",
  isGuest(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .trim()
    .isAlphanumeric()
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters long and should be alphanumeric"
    ),
  body("repeatPw")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords don't match"),
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const result = validationResult(req);

      if (result.errors.length) {
        throw result.errors;
      }

      if (result.errors.length) {
        throw new Error(errors.map((error) => error.msg).join("\n"));
      }

      const user = await register(email, password);
      const token = generateToken(user);

      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    } catch (err) {
      res.render("register", {
        input: { email },
        errors: parseError(err).errors,
      });
      return;
    }
  }
);

userRouter.get("/login", isGuest(), (req, res) => {
  res.render("login");
});

userRouter.post("/login", isGuest(), async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await login(email, password);
    const token = generateToken(user);

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (err) {
    res.render("login", { input: { email }, error: err.message });
  }
});

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = { userRouter };
