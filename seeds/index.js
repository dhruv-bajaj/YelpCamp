const mockData = require("./mockData");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(`Connected to ${err}`);
  });

// To handle errors after initial connection was established
mongoose.connection.on("error", (err) => {
  console.log(err);
});

const Campground = require("../models/campground");
const insertMockData = async () => {
  await Campground.deleteMany({});
  Campground.insertMany(mockData)
    .then(() => {
      console.log("Data inserted");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log(`${err}`);
    });
};
insertMockData();
