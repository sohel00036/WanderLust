
if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
console.log(process.env.CLOUD_NAME);




const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const {listingSchema, reviewSchema}= require("./schema.js");
// const { strictEqual } = require("assert");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const session= require("express-session");
const MongoStore = require('connect-mongo');

const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local")
const User= require("./models/user.js");

const dbUrl= process.env.ATLAS_URL;

app.engine("ejs", ejsMate);
// // Parse JSON and form data
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));



main()
  .then((res) => console.log("started with mongoose"))
  .catch((err) => console.log(err));
async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  await mongoose.connect(dbUrl);
}

const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter: 24*60*60, // time in seconds (not milliSeconds) for one day
})

store.on("error", ()=>{
  console.log("ERROR in MONGO SESSION STORE", err); 
})
const sessionOptions={
  store: store, // or sirf store bhi likh skte hai
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 1000*60*60*24*3,
    maxAge: 1000*60*60*24*3,
    httpOnly: true,
  }
}


  
// app.get("/", (req, res) => {
//   res.send("hello ");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser=req.user;
  next();
})

// app.get("/demouser", async(req,res)=>{
//   let fakeUser= new User({
//     email: "student@mnit.ac.in",
//     username:"SowelHussain0036",

//   })
//   let registeredUser= await User.register(fakeUser, "helloworld");
//   console.log(registeredUser);
//   res.send(registeredUser);
// })






app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).send(message);
    res.render("error.ejs",{message} );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
