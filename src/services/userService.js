const bcrypt = require("bcryptjs");
const { User } = require("../models/User");

async function register(email, password) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const user = new User({
    email,
    password: await bcrypt.hash(password, 10),
  });

  await user.save();

  return user;
}

async function login(email, password) {
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new Error("Incorrect email address or password");
  }

  const match = await bcrypt.compare(password, existingUser.password); // needed to export it as async operations always return a promise, which is a truthy object or the if check will not work properly

  if (!match) {
    throw new Error("Incorrect email address or password");
  }
  return existingUser;
}

module.exports = { register, login };
