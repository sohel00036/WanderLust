// Great job modularizing the app.js by moving routes to a separate file.

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const path = require("path");
const passport = require("passport"); // ✅ Missing import added
const {saveRedirectUrl}= require("../middleware.js");
const userController= require("../controllers/user.js");


router.route("/signup")
.get( userController.getSignup)
.post(
  wrapAsync(userController.postSignup)
);
router.route("/login")
.get(userController.getLogin )
.post(
  
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.postLogin
);

router.get("/logout", userController.logout)
module.exports = router;
