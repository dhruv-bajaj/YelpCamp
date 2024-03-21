// Creating a middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('errorMessage','Please log in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports = isAuthenticated;
