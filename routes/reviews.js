const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Review = require("../models/review");
const validateSchemaUsingJoi = require("../utils/validateSchemaUsingJoi");
const isAuthenticated = require("../utils/isAuthenticated");
const isAuthorOfThisReview = require("../utils/isAuthorOfThisReview");
router.post(
  "/new",
  validateSchemaUsingJoi("Review"),
  isAuthenticated,
  catchAsync(async (req, res) => {
    const { id: campgroundId } = req.params;
    const { review } = req.body;
    const newReview = Review({
      ...review,
      campground: campgroundId,
      author: req.user._id,
    });
    await newReview.save();
    req.flash("message", "Successfully made a new review");
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  isAuthorOfThisReview,
  catchAsync(async (req, res) => {
    const { id: campgroundId, reviewId: reviewId } = req.params;
    await Review.deleteOne({ _id: reviewId });
    req.flash("message", "Successfully deleted the review");
    res.redirect(`/campgrounds/${campgroundId}`);
  })
);

module.exports = router;
