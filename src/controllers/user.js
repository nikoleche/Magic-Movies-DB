const { generateToken } = require("../services/token");
const { register, login } = require("../services/userService");

module.exports = {
  registerGET: (req, res) => {
    res.render("register");
  },
  registerPOST: async (req, res) => {
    const { email, password, repeatPw } = req.body;

    try {
      if (!email || !password) {
        throw new Error("All fields are required");
      }
      if (password !== repeatPw) {
        throw new Error("Passwords don't match");
      }

      const user = await register(email, password);
      const token = generateToken(user);

      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    } catch (err) {
      res.render("register", { input: { email }, error: err.message });
      return;
    }
  },
  loginGET: (req, res) => {
    res.render("login");
  },
  loginPOST: async (req, res) => {
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
  },
  logout: (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  },
};
