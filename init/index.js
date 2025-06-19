const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log(process.env.CLOUD_NAME);



const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
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
  initData.data=initData.data.map((obj)=>({...obj, owner:"684fcc7de94e2e9e2dc436c7"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();