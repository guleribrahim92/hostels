var express=require("express"),
app=express(),
bodyParser=require("body-parser"),
mongoose=require("mongoose"),
flash=require("connect-flash"),
passport=require("passport"),
LocalStrategy=require("passport-local"),
methodOverride=require("method-override"),
Hostel=require("./models/hostel"),
Comment=require("./models/comment"),
User=require("./models/user"),
seedDB= require("./seeds");
//seedDB();
mongoose.connect('mongodb://localhost:27017/hostel_app', { useNewUrlParser: true }); 
app.use(bodyParser.urlencoded({extended:true})); 
//var request=require("request");
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
var commentRoutes=require("./routes/comments"),
hostelRoutes=require("./routes/hostels"),
indexRoutes=require("./routes/index");


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"You are wonderful",
    resave:false,
    saveUninitialized:false
}));

//DEVAM
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//each route now have user credentials 
app.use(function(req,res,next){
res.locals.currentUser=req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");

next();    
});

app.use(indexRoutes);
app.use(hostelRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("The HostelApp app has started"); 
});