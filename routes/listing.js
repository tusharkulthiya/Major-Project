const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const lisitngController = require("../controllers/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        console.log(error);
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}


router
.route("/")
.get(wrapAsync(lisitngController.index))
.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(lisitngController.createListing));



//new route
router.get("/new", isLoggedIn, lisitngController.renderNewForm);

//show route
router.get("/:id", wrapAsync(lisitngController.showListing));

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(lisitngController.renderEditForm));

//update route
router.put("/:id", isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(lisitngController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(lisitngController.deleteListing));


module.exports = router;