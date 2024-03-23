const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Campground = require("./campground");
const User = require('./user');

const ReviewSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: "Campground",
    required: true,
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: User
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
