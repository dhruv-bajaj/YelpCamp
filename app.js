//Requiring the env variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//Setting up express server
const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
const path = require("path");
const campgroundsRouter = require("./routes/campgrounds");
const usersRouter = require("./routes/users");
const reviewsRouter = require("./routes/reviews");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const session = require("express-session");
const MongoStore = require("connect-mongo");

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

const connection  = mongoose
  .connect(process.env.DBSTR)
  .then((m) => {
    console.log("Connected to database");
    return m.connection.getClient();
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
app.use(mongoSanitize());

//logging middleware
app.use(morgan("tiny"));

const store = MongoStore.create({
  clientPromise: connection,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.STORE_SECRET,
  }
});

const sessionConfig = {
  store: store,
  name: "yelpcampsession",
  secret:  process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.NODE_ENV === "production" ? true : false,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//helmet middleware
app.use(helmet());

const scriptSrcUrls = ["https://cdn.jsdelivr.net"];
const styleSrcUrls = ["https://cdn.jsdelivr.net"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dma8h02vh/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'"],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.message = req.flash("message");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
//request hadlers
app.use("/", usersRouter);
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);

app.get("/", (req, res) => {
  res.render("home");
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
