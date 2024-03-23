const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const validateSchemaUsingJoi = require("../utils/validateSchemaUsingJoi");
const isAuthenticated = require("../utils/isAuthenticated");
const isAuthor = require("../utils/isAuthor");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
router.get("/new", isAuthenticated, (req, res) => {
  res.render("campgrounds/new");
});
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
      const campground = await Campground.findOne({ _id: id }).populate(
        "author"
      );
      if (!campground) {
        req.flash("errorMessage", "Campground not found");
        return res.redirect("/campgrounds");
      }
      const reviews = await Review.find({ campground: id }).populate('author');
      res.render("campgrounds/show", { campground, reviews });
    } catch (err) {
      res.render("error");
    }
  })
);

router.post(
  "/",
  isAuthenticated,
  validateSchemaUsingJoi("Campground"),
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground({
      ...campground,
      author: req.user._id,
    });
    await newCampground.save();
    req.flash("message", "Successfully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findOne({ _id: id });
    res.render("campgrounds/edit", { campground });
  })
);
router.patch(
  "/:id/edit",
  isAuthenticated,
  isAuthor,
  validateSchemaUsingJoi("Campground"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findOneAndUpdate({ _id: id }, campground, {
      runValidators: true,
    });
    req.flash("message", "Successfully updated the campground");
    res.redirect("/campgrounds");
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
      await Campground.findByIdAndDelete({ _id: id });
      req.flash("message", "Successfully deleted the campground");
      res.redirect("/campgrounds");
    } catch (err) {
      console.log(`Error while deleting: ${err}`);
    }
  })
);

module.exports = router;
