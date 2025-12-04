// routes/listing.js
const express = require("express");
const router = express.Router();

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const multer= require("multer");
const {storage,cloudinary}= require("../cloudConfig.js");
const upload= multer({storage});

// Index Route 
// Create Listing
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,    
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// router
//   .route("/")
//   .get(wrapAsync(listingController.index))
//   // .post(
//   //   isLoggedIn,
//   //   validateListing,
//   //   wrapAsync(listingController.createListing)
//   // );
//   .post( upload.single('listing[image][url]'), (req,res)=>{
//     res.send(req.file);
//     // res.send("hellow");
//   })  
// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Listing
// Update Listing 
// Delete Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
