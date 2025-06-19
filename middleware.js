const Listing= require("./models/listing.js");
const Review= require("./models/review.js");

const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("./schema.js");


module.exports.isLoggedIn= (req, res, next)=>{
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req, res, next)=>{
    let {id}= req.params;
    let list= await Listing.findById(id);
    
    if (!list) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }
    if (!list.owner.equals(req.user._id)) {
       req.flash("error", "You don't have permission to edit.");
       return res.redirect(`/listings/${id}`);
    } 
    next();

}
module.exports.isReviewAuthor= async(req, res, next)=>{
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!req.user || !review.author.equals(req.user._id)){
        req.flash("error", "You don't have permission to delete the comment. Since you are not the author of this comment.");
        return res.redirect(`/listings/${id}`);
    }
     
    next();

}
module.exports.validateListing= (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if (error) {
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
} 

module.exports.validateReview= (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if (error) {
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
} 