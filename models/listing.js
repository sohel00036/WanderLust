const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;


const imageSchema = new Schema({
  filename: String,
  url: {
    type: String,
    default: "https://img.freepik.com/premium-photo/amazing-summer-beach-background-sunset-landscape-square-format-honeymoon-couple-icon-banner_663265-6789.jpg"
  }
}, { _id: false });  // Disable _id for this subdocument

const listingSchema = new Schema({
  title: {
    type: String,   
    required: true
  },
  description: String,
  image: {
    type: imageSchema,
    // required: true,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
  }
});
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
      await Review.deleteMany({_id: { $in: listing.reviews}})
  }
  
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
