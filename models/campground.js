const mongoose = require("mongoose");
const Review = require("./review");
const { Schema, model } = mongoose;
const User = require("./user");

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload","/upload/w_200");
});
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
  images: {
    type: Array,
    of: ImageSchema,
    validate: (imagesArray) => imagesArray.length > 0,
  },
  location: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//Middleware to delete all associated reviews
CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({ campground: doc._id });
  }
});
//Creating the model
const Campground = model("Campground", CampgroundSchema);

module.exports = Campground;
