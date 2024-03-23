const Review = require("../models/review");
const isAuthor = async (req, res, next) => {
  const { id: campgroundId, reviewId: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (review && review.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("errorMessage", "You don't have permission to do this!");
    return res.redirect(`/campgrounds/${campgroundId}`);
  }
};

module.exports = isAuthor;
