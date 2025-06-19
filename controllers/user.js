
const User = require("../models/user.js");
const passport = require("passport"); // ✅ Missing import added



module.exports.getSignup=(req, res) => {
  res.render("user/signup.ejs");
}

module.exports.postSignup= async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registereduser = await User.register(newUser, password);
      console.log(registereduser);
      req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      } )
      
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

module.exports.getLogin= async (req, res) => {
  res.render("user/login.ejs");
}

module.exports.postLogin= async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    console.log(res.locals.redirectUrl)
    res.redirect(res.locals.redirectUrl || "/listings");
  }

module.exports.logout= (req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}