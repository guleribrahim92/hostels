var  express=require("express"),
router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/",function(req,res){
   res.render("landing"); 
});

//REGISTER
//show registiration form
router.get("/register",function(req, res) {
   res.render("register"); 
});

//handle sign up logic
router.post("/register",function(req, res) {
var newUser=new User({username:req.body.username});
User.register(newUser,req.body.password,function(err,user){
   if(err){
       req.flash("error",err);
       return res.render("register");
   } 
   passport.authenticate("local")(req,res,function(){
      req.flash("success","welcome to jungle" + req.body.username);
      res.redirect("/hostels"); 
       
   });
   
});
    
});

//Show LOGIN form
router.get("/login",function(req, res) {
   res.render("login");
});

//handle login with middleware
router.post("/login",passport.authenticate("local",
{
    successRedirect:"/hostels",
    failureRedirect:"/login"
}), function(req, res) {
});

//LOG OUT ROUTE
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","Logged out successfully")
    res.redirect("/hostels");
});
//sadece giriş yapanlar yorum yapabilir
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    
    res.redirect("/login");
    
}

module.exports=router;