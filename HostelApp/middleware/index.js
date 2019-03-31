var Hostel=require("../models/hostel");
var Comment=require("../models/comment");
//all middlewares goes here
var middlewareObj={};

//başka middleware to check if current user owns the post
middlewareObj.checkHostelOwnership=function(req,res,next){ 
    if(req.isAuthenticated()){
    Hostel.findById(req.params.id, function(err,foundHostel) {
        if(err){
        req.flash=("error","hostel not found");    
        res.redirect("back");
        }else {
            if(!foundHostel){
                req.flash=("error","item not found");
                return res.redirect("back");
            }
        
        if(foundHostel.author.id.equals(req.user._id)){
        next();
        } else {
        req.flash("error"," user id is not matched ");
         res.redirect("back ");
        //res.redirect("/hostels");
        }
        }
      });    
        } else {
        req.flash=("error","you need to be logged in");    
        res.redirect("/login");
    }
}

//başka middleware to check if current user owns the post
middlewareObj.checkCommentOwnership=function(req,res,next){ 
    if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err,foundComment) {
        if(err){
        res.redirect("back");
        } else {
        if(foundComment.author.id.equals(req.user._id)){
        next();
        } else {
            //res.send("OPPSS SOMETHING WENT WRONG! PLEASE CHECK YOUR ID ");
        res.redirect("back");
        }
        }
       });    
        } else {
        res.redirect("/login");
    }
};


//sadece giriş yapanlar yorum yapabilir
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
   req.flash("error"," Must be Logged in ");
    res.redirect("/login");
    
};






module.exports=middlewareObj;