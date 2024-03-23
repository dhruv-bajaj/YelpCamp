const Campground = require('../models/campground');
const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (campground && campground.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("errorMessage", "You don't have permission to do this!");
    return res.redirect(`/campgrounds/${id}`);
  }
};

module.exports = isAuthor;