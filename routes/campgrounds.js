const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const validateSchemaUsingJoi = require("../utils/validateSchemaUsingJoi");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
      const campground = await Campground.findOne({ _id: id });
      if(!campground){
        req.flash("errorMessage", "Campground not found");
        return res.redirect("/campgrounds");
      }
      const reviews = await Review.find({ campground: id });
      res.render("campgrounds/show", { campground, reviews });
    } catch (err) {
      res.render("error");
    }
  })
);

router.post(
  "/",
  validateSchemaUsingJoi("Campground"),
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    const newCampground = new Campground({ ...campground });
    await newCampground.save();
    req.flash("message", "Successfully made a new campground");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findOne({ _id: id });
    res.render("campgrounds/edit", { campground });
  })
);
router.patch(
  "/:id/edit",
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
