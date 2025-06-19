const Listing= require("../models/listing.js");
const Review= require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");


module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  }

 module.exports.destroyReview =  async (req, res) => {
    // console.log("hey i am iniside the delte review section .");
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");

    res.redirect(`/listings/${id}`);
  }