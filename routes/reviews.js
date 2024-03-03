const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const validateSchemaUsingJoi = require("../utils/validateSchemaUsingJoi");

router.post(
  "/new",
  validateSchemaUsingJoi("Review"),
  catchAsync(async (req, res) => {
    const { id: campgroundId } = req.params;
    const { review } = req.body;
    const newReview = Review({ ...review, campground: campgroundId });
    await newReview.save();
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id: campgroundId, reviewId: reviewId } = req.params;
    await Review.deleteOne({ _id: reviewId });
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

module.exports = router;
