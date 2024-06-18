const { Schema, SchemaTypes: Types, model } = require("mongoose");

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [5, "Longer title required"],
    match: [/^[a-z0-9 ]+$/gi, "Title must be alphanumeric"],
  },
  genre: {
    type: String,
    required: true,
    minLength: 5,
    match: /^[a-z0-9 ]+$/gi,
  },
  director: {
    type: String,
    required: true,
    minLength: 5,
    match: /^[a-z0-9 ]+$/gi,
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2100,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  description: {
    type: String,
    required: true,
    minLength: 20,
    match: /^[a-z0-9 ]+$/gi,
  },
  imageURL: {
    type: String,
    required: true,
    match: /^https?:\/\/.+/,
  },
  cast: {
    type: [Types.ObjectId],
    ref: "Cast",
    default: [],
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Movie = model("Movie", movieSchema);

module.exports = { Movie };
