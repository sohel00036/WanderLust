const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log(process.env.CLOUD_NAME);



const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User= require("../models/user.js");
const Review= require("../models/review.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLAS_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Review.deleteMany({});

  // Check if user exists, or create one
  let user = await User.findOne({ username: "admin" });
  if (!user) {
    user = new User({ email: "admin@gmail.com", username: "admin" });
    await User.register(user, "1234"); // hashed password with passport-local-mongoose
    console.log("admin was not found, So a new user named admin is made.")
  }

  // Assign the valid user ID
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: user._id,
  }));

  await Listing.insertMany(initData.data);
  console.log("Sample listings initialized.");
};

initDB();