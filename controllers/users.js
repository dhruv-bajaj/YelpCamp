const passport = require("passport");
const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("message", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("errorMessage", e.message);
    return res.redirect("/register");
  }
};

module.exports.login = async (req, res) => {
  req.flash("message", "Welcome back to Yelp Camp!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("message", "Goodbye!");
    res.redirect("/login");
  });
};
