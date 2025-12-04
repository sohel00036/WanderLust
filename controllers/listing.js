// controllers/listing.js
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!list) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listing/show.ejs", { list });
}; 

module.exports.createListing = async (req, res) => {
  let url= req.file.path;
  let filename= req.file.filename;
  console.log(url,"..../././....", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image= {url,filename};
  await newListing.save(); 
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  let originalImageUrl=list.image.url;
  newImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listing/update.ejs", { list,newImageUrl });
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing; 

  // If user uploaded a new image
  if (req.file) {
    listingData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await Listing.findByIdAndUpdate(id, listingData, { new: true });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};