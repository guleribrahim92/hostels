var  express=require("express"),
router=express.Router(  //{mergeParams:true}; ); app.use("/hostels/:id/comments",commentRoutes)
); 
var Hostel=require("../models/hostel");
var Comment=require("../models/comment");
var middleware=require("../middleware");
//COMMENTS ROUTES
router.get("/hostels/:id/comments/new",middleware.isLoggedIn,function(req, res) {
//find campground by id
Hostel.findById(req.params.id,function(err,hostel){
    if(err){
        console.log(err);
    } else {
        res.render("comments/new",{hostel:hostel});
    }
    
});
    
});

//comment create
router.post("/hostels/:id/comments",middleware.isLoggedIn,function(req,res){
    Hostel.findById(req.params.id,function(err, hostel) {
       if(err){
           console.log(err);
           res.redirect("/hostels");
       } else {
           Comment.create(req.body.comment,function(err,comment){
              if(err){
                  console.log(err)
              } else {
                  //get user id and name automatically
                  comment.author.id=req.user._id;
                  comment.author.username=req.user.username;
                  comment.save();
                  hostel.comments.push(comment);
                  hostel.save();
                     req.flash("success"," Succesfully added ");

                  console.log(comment);
                  res.redirect("/hostels/" + hostel._id);
              }
           });
       }
    });
});

//comment edit 
router.get("/hostels/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
       if(err){
           res.redirect("back");
       } else { 
   res.render("comments/edit",{hostel_id:req.params.id, comment:foundComment});
       }
    });
    //hostels/:id/comments/:comment_id/edit
});

router.put("/hostels/:id/comments/:comment_id",function(req,res){
Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       }else {
           res.redirect("/hostels/" + req.params.id);
       }
    });
});
//COMMENT DESTROY
router.delete("/hostels/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
   if(err){
       res.redirect("back");
   }     else{
       res.redirect("/hostels/"+ req.params.id);
   }
        
    });
});



module.exports=router;
