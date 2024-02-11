//Seeting up express server
const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");

// Setting up ejs
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//Importing the models
const Campground = require("./models/campground");

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

//request hadlers
app.get("/", (req, res) => {
  res.redirect("/campgrounds");
});
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findOne({ _id: id });
    res.render("campgrounds/show", { campground });
  } catch (err) {
    res.render("error");
  }
});
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const campground = await Campground.findOne({ _id: id });
    res.render("campgrounds/show", { campground });
  } catch (err) {
    res.render("error");
  }
});

app.get("/makecampground", async (req, res) => {
  const campground = new Campground({
    title: "Backyard of home",
    price: "free",
    description: "Home",
    location: "Saharanpur",
  });
  await campground.save();
  res.render("Home", { campground });
});

app.post("/campgrounds", async (req, res) => {
  const { campground } = req.body;
  const newCampground = new Campground({ ...campground });
  await newCampground.save();
  res.redirect("/campgrounds");
});
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findOne({ _id: id });
  res.render("campgrounds/edit", { campground });
});
app.patch("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { campground } = req.body;
  console.log(campground);
  await Campground.findOneAndUpdate({ _id: id }, campground, {
    runValidators: true,
  });
  res.redirect("/campgrounds");
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Campground.findOneAndDelete({ _id: id });
    res.redirect("/campgrounds");
  } catch (err) {
    console.log(`Error while deleting: ${err}`);
  }
});

app.use((req, res) => {
  res.status(404).send("Not Found !");
});

app.listen(PORT, () => {
  console.log(`Serving on port: ${PORT}`);
});
