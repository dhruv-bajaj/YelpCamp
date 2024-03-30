const Campground = require("../models/campground");
const Review = require("../models/review");
const { cloudinary } = require("../cloudinary");

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
  const images = req.files.map((image) => {
    return {
      url: image.path,
      fileName: image.filename,
    };
  });
  const newCampground = new Campground({
    ...campground,
    images: images,
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
  const { campground: campgroundData, deleteImages=[]} = req.body;
  const campground = await Campground.findById(id);

  let campgroundImages = [];
  for (const img of campground.images) {
    if (deleteImages.includes(img.fileName)) {
      await cloudinary.uploader.destroy(img.fileName);
    } else {
      campgroundImages.push(img);
    }
  }

  const images = req.files.map((image) => {
    return {
      url: image.path,
      fileName: image.filename,
    };
  });
  if (images && images.length > 0) {
    campgroundImages.push(...images);
  }
  campgroundData.images = campgroundImages;
  await Campground.findByIdAndUpdate({ _id: id }, campgroundData, {
    runValidators: true,
  });
  req.flash("message", "Successfully updated the campground");
  res.redirect(`/campgrounds/${id}`);
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
