//Setting up express server
const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const path = require("path");

//Requiring Joi for schema validation
const Joi = require("joi");

//Importing catchAsync wrapper function and ExpressError class
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

//Setting up ejs-mate
const ejsMate = require("ejs-mate");

//Here we are registering the template engine
// This callback function will be called for ejs files
app.engine("ejs", ejsMate);

// Setting up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Importing the models
const Campground = require("./models/campground");
const Review = require("./models/review");

//Connecting to database
const mongoose = require("mongoose");
const { createDiffieHellmanGroup } = require("crypto");

//Logging
const morgan = require("morgan");
const { campgroundSchemaJoi, reviewSchemaJoi } = require("./schemasJoi");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(`Error while connecting to db: ${err}`);
  });

// To handle errors after initial connection was established
mongoose.connection.on("error", (err) => {
  console.log(err);
});

//middleware to check schema using Joi
const validateSchemaUsingJoi = (schemaOf) => {
  return async (req, res, next) => {
    let validateSchema;
    if (schemaOf == "Campground") {
      validateSchema = campgroundSchemaJoi;
    } else if (schemaOf == "Review") {
      validateSchema = reviewSchemaJoi;
    }
    const { error } = validateSchema.validate(req.body);
    if (error) {
      const message = error.details.map((el) => el.message).join(",");
      next(new ExpressError(message, 400));
    } else {
      next();
    }
  };
};

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//logging middleware
app.use(morgan("tiny"));

//request hadlers
app.get("/", (req, res) => {
  res.redirect("/campgrounds");
});
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
      const campground = await Campground.findOne({ _id: id });
      const reviews = await Review.find({ campground: id });
      res.render("campgrounds/show", { campground, reviews });
    } catch (err) {
      res.render("error");
    }
  })
);
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findOne({ _id: id });
    res.render("campgrounds/show", { campground });
  })
);

app.post(
  "/campgrounds",
  validateSchemaUsingJoi("Campground"),
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground({ ...campground });
    await newCampground.save();
    res.redirect("/campgrounds");
  })
);
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findOne({ _id: id });
    res.render("campgrounds/edit", { campground });
  })
);
app.patch(
  "/campgrounds/:id/edit",
  validateSchemaUsingJoi("Campground"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findOneAndUpdate({ _id: id }, campground, {
      runValidators: true,
    });
    res.redirect("/campgrounds");
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
      await Campground.findByIdAndDelete({ _id: id });
      res.redirect("/campgrounds");
    } catch (err) {
      console.log(`Error while deleting: ${err}`);
    }
  })
);

app.post(
  "/campgrounds/:id/reviews/new",
  validateSchemaUsingJoi("Review"),
  catchAsync(async (req, res) => {
    const { id: campgroundId } = req.params;
    const { review } = req.body;
    const newReview = Review({ ...review, campground: campgroundId });
    await newReview.save();
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id: campgroundId, reviewId: reviewId } = req.params;
    await Review.deleteOne({ _id: reviewId });
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log("Reached Here");
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong !!!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Serving on port: ${PORT}`);
});
