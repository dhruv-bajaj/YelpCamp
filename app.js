//Setting up express server
const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const path = require("path");
const campgroundsRouter = require("./routes/campgrounds");
const usersRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('./models/user');

//Importing  ExpressError class
const ExpressError = require("./utils/ExpressError");

//Setting up ejs-mate
const ejsMate = require("ejs-mate");

//Here we are registering the template engine
// This callback function will be called for ejs files
app.engine("ejs", ejsMate);

// Setting up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Connecting to database
const mongoose = require("mongoose");
const { createDiffieHellmanGroup } = require("crypto");

//Logging
const morgan = require("morgan");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(`Error while connecting to db: ${err}`);
  });

// To handle errors after initial connection was established
mongoose.connection.on("error", (err) => {
  console.log(err);
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//logging middleware
app.use(morgan("tiny"));

const sessionConfig = {
  secret: "thisIsASecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
//request hadlers
app.use('/',usersRouter)
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.redirect("/campgrounds");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong !!!";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Serving on port: ${PORT}`);
});
