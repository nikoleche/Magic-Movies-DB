const jwt = require("jsonwebtoken");

const secret = "tokensecret";

function generateToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "24h" });
  return token;
}

function verifyToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { generateToken, verifyToken };
