const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const validateSchemaUsingJoi = require("../utils/validateSchemaUsingJoi");
const isAuthenticated = require("../utils/isAuthenticated");
const isAuthorOfThisReview = require("../utils/isAuthorOfThisReview");
const reviewController = require("../controllers/reviews");

router.post(
  "/new",
  validateSchemaUsingJoi("Review"),
  isAuthenticated,
  catchAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  isAuthorOfThisReview,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
