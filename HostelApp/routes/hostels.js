var  express=require("express"),
router=express.Router();
var Hostel=require("../models/hostel");
//var Comment=require("../models/comment")
var middleware=require("../middleware");

//INDEX-show all hostels
router.get("/hostels",function(req,res){
   // 
//Get all hostels from DB
Hostel.find({},function(err,allHostels){
   if(err){
       console.log(err);
   } else {
       console.log("yay");
res.render("hostels/index",{hostels:allHostels});
   }
});
    
});
 
router.post("/hostels",middleware.isLoggedIn,function(req,res){
   //get data from form and add to campgrounds array
  
   var name=req.body.name;
   var image=req.body.image;
   var description=req.body.description;
   var price=req.body.price;
   var author= {
       id:req.user._id,
       username:req.user.username
   };
   var newHostel= {name:name,image:image,description:description,price:price,author:author};
   console.log(req.user);
//create a hostel save it to DB
Hostel.create(newHostel,function(err,newlyCreated ){
    if(err){
        console.log(err);
    } else {
    console.log(newlyCreated);    
    //redirect to hostel ppage
    res.redirect("/hostels");
    }
});
});

//show form to create a new hostel
router.get("/hostels/new",middleware.isLoggedIn, function(req, res) {
   res.render("hostels/new"); 
    
});

router.get("/hostels/:id",function(req, res) {
    //find the hostel with provided ID,
   //populate the comments under foundhostel
   Hostel.findById(req.params.id).populate("comments").exec(function(err,foundHostel){
        if(err){
            console.log(err);
        } else{
         console.log(foundHostel);
      //render show template with that hostel
      res.render("hostels/show",{hostel:foundHostel});
        }
    });
});
//EDIT HOSTEL ROUTE
router.get("/hostels/:id/edit",middleware.checkHostelOwnership,function(req, res) {
    Hostel.findById(req.params.id,function(err,foundHostel){
        if(err){
            req.flash=("error",err);
        }else {
     res.render("hostels/edit", {hostel:foundHostel}); 
    
        }
        });
});

//UPDATE HOSTEL ROUTE
router.put("/hostels/:id",middleware.checkHostelOwnership,function(req,res){
   //find and update the correct hostel 
 Hostel.findByIdAndUpdate(req.params.id,req.body.hostel,function(err,updatedHostel){
 if(err){
     res.redirect("/hostels");
 }       else {
      res.redirect("/hostels/"+req.params.id );
 }
   });
    
});

//DESTROY ROUTE /hostels/:id
router.delete("/hostels/:id",middleware.checkHostelOwnership,function(req,res){
Hostel.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/hostels");
    } else{
        res.redirect("/hostels");
    }
    
});    
});


module.exports=router;