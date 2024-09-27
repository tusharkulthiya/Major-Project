if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js");



const listings=require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");

const MONGO_URL=process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



main().then(()=>{
    console.log("Connected to db");
}).catch(err =>{
    console.log(err);
})

async function main() {
    mongoose.connect(MONGO_URL); 
}

const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRET,  
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log(err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"Cheetha@gmail.com",
//         username:"Cheehta"
//     });

//     let registeredUser = await User.register(fakeuser,"CheethaHiKehDe");
//     res.send(registeredUser);
// })

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);


// app.get("/testListing",async (req,res)=>{
// let samplelisting=new Listing({
//     title:"My villa",
//     description:"By beach side",
//     price:2132,
//     location:"Goa",
//     country:" India",
// });
// await samplelisting.save();
// console.log("saved");
// res.send("successful Testing"); 
// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});



app.use((err,req,res,next)=>{
let {statusCode=500,message="Something went Wrong"}=err;
res.render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server Runnng");
})