const mongoose = require("mongoose");
require("../models/Movie");
require("../models/Cast");
require("../models/User");

// to update movies, export Movie and User as variables

const connectionString = "mongodb://localhost:27017/moviemagicdb";

async function configDatabase() {
  await mongoose.connect(connectionString);

  // await migrateMovies();

  console.log("DB linked successfully");
}

module.exports = { configDatabase };

// async function migrateMovies() {
//   const firstUser = await User.findOne();

//   await Movie.updateMany({}, { $set: { author: firstUser._id } });
// }

// update database entries
