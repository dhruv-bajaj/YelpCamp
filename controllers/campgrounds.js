const Campground = require("../models/campground");
const Review = require("../models/review");
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.new = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.getCampgroundById = async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findOne({ _id: id }).populate("author");
    if (!campground) {
      req.flash("errorMessage", "Campground not found");
      return res.redirect("/campgrounds");
    }
    const reviews = await Review.find({ campground: id }).populate("author");
    res.render("campgrounds/show", { campground, reviews });
  } catch (err) {
    res.render("error");
  }
};

module.exports.createCampground = async (req, res) => {
  const { campground } = req.body;
  const newCampground = new Campground({
    ...campground,
    author: req.user._id,
  });
  await newCampground.save();
  req.flash("message", "Successfully made a new campground");
  res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findOne({ _id: id });
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const { campground } = req.body;
  await Campground.findOneAndUpdate({ _id: id }, campground, {
    runValidators: true,
  });
  req.flash("message", "Successfully updated the campground");
  res.redirect("/campgrounds");
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  try {
    await Campground.findByIdAndDelete({ _id: id });
    req.flash("message", "Successfully deleted the campground");
    res.redirect("/campgrounds");
  } catch (err) {
    console.log(`Error while deleting: ${err}`);
  }
};
