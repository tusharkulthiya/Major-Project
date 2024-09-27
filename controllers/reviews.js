const Listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview=async(req,res)=>{
    let lisitng=await Listing.findById(req.params.id);
    let newreview=new review(req.body.review);
    newreview.author=req.user._id;
    lisitng.reviews.push(newreview);

    await newreview.save();
    await lisitng.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${lisitng._id}`);
};

module.exports.deleteReview=async(req,res)=>{
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};