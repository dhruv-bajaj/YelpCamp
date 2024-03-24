const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const validateSchemaUsingJoi = require("../utils/validateSchemaUsingJoi");
const isAuthenticated = require("../utils/isAuthenticated");
const isAuthor = require("../utils/isAuthor");
const campgroundController = require("../controllers/campgrounds");

router.get("/", catchAsync(campgroundController.index));

router.get("/new", isAuthenticated, campgroundController.new);

router.get("/:id", catchAsync(campgroundController.getCampgroundById));

router.post(
  "/",
  isAuthenticated,
  validateSchemaUsingJoi("Campground"),
  catchAsync(campgroundController.createCampground)
);

router.get(
  "/:id/edit",
  isAuthenticated,
  isAuthor,
  catchAsync(campgroundController.editCampground)
);

router.patch(
  "/:id/edit",
  isAuthenticated,
  isAuthor,
  validateSchemaUsingJoi("Campground"),
  catchAsync(campgroundController.updateCampground)
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthor,
  catchAsync(campgroundController.deleteCampground)
);

module.exports = router;
