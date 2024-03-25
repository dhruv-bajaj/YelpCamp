const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
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

const getRandomElementFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const Campground = require("../models/campground");
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${getRandomElementFromArray(
        descriptors
      )} ${getRandomElementFromArray(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dma8h02vh/image/upload/v1711370747/yelp-camp/mfd60zit7uwo0petxpps.jpg",
          fileName: "yelp-camp/mfd60zit7uwo0petxpps",
        },
      ],
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. `,
      price: `${Math.floor(Math.random() * 2000) + 799}`,
      author: "65f6b37d974d98959c6b267f",
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close().then(() => {
    console.log("Connection closed");
  });
});
