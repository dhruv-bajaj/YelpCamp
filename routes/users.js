const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../utils/returnToMiddleware");
const userController = require("../controllers/users");
const isAuthenticated = require("../utils/isAuthenticated");

router.get("/register", userController.renderRegister);

router.post("/register", catchAsync(userController.register));

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(userController.login)
);

router.get("/logout",isAuthenticated, userController.logout);

module.exports = router;
