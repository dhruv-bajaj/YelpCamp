const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
  const { id: campgroundId, reviewId: reviewId } = req.params;
  await Review.deleteOne({ _id: reviewId });
  req.flash("message", "Successfully deleted the review");
  res.redirect(`/campgrounds/${campgroundId}`);
};
