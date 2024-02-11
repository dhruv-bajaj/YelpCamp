const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Creating the schema
const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

//Creating the model
const Campground = model("Campground", CampgroundSchema);

module.exports = Campground;
