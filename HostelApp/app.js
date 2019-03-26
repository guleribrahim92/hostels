var express=require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose=require("mongoose");
var Hostel=require("./models/hostel"),
seedDB=require("./seeds");
mongoose.connect('mongodb://localhost:27017/hostel_app', { useNewUrlParser: true }); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/",function(req,res){
   res.render("landing"); 
});

//INDEX-show all hostels
app.get("/hostels",function(req,res){
//get them from DB
Hostel.find({},function(err,allHostels){
    if(err){
        console.log(err);
    }else {
    res.render("hostels/index", {hostels:allHostels}); 
    }
});   
});

//CREATE-ADD new hostel to DB
app.post("/hostels",function(req,res){
   //get data from form and add it to hostel array
   var name=req.body.name;
   var image=req.body.image;
   var desc=req.body.description;
   var newHostel={name:name,image:image,description:desc};
   //create a new hostel and save to DB
   Hostel.create(newHostel,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           res.redirect("/hostels");
       }
   });
});
   //show form to create a new hostel
app.get("/hostels/new",function(req, res) {
   res.render("hostels/new"); 
});   
   //SHOW MORE INFO ABOUT A ONE hostel
   app.get("/hostels/:id",function(req, res) {
      //find the hostel with given id 
      Hostel.findById(req.params.id).populate("comments").exec(function(err,foundHostel){
         if(err){
             console.log(err);
         } else {
             console.log(foundHostel);
             //render show template with that hostel
             res.render("hostels/show",{hostel:foundHostel});
         }
      });
   });

// ====================
// COMMENTS ROUTES
// ====================

app.get("/hostels/:id/comments/new",function(req, res) {
   Hostel.findById(req.params.id,function(err,hostel){
       if(err){
          console.log(err); 
       }else {
           res.render("comments/new",{hostel:hostel})
       }
   }) 
});

app.post("/hostels/:id/comments",function(req,res){
    Hostel.findById(req.params.id,function(err, hostel) {
        if(err){
        console.log(err);
        }else {
        Comment.create(req.body.comment,function(err,comment){
        if(err){
        console.log(err);
        } else {
         hostel.comments.push(comment);
         hostel.save();
         res.redirect("/hostels" + hostel._id);
            }
        });
    }
});
//create new comment
//connect new comment to the hostel
//redirect to hostel show page
    
});








/*var destinations = [
    {name: "Paris", image: "https://d39gusjpdm7p1o.cloudfront.net/data/layout_grouping/static_page_step/20784/a330628091ede7eb1548d6cda58e0357.jpg?ver=1477297804"},
    {name: "Rome", image: "https://cdn.fodors.com/wp-content/uploads/2018/10/HERO_UltimateRome_Hero_shutterstock789412159.jpg"},
    {name: "Istanbul", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU6PIVOC8wmOcXO9EuB4Wqexn4t0WnkTSav-JtPyCVQiASU1al"},
    {name: "Los Angeles", image: "https://static1.squarespace.com/static/57d9e959d482e972e8434364/t/5be79be9c2241bb5cb774bb4/1541905391787/shutterstock_633629336.jpg"},
    {name: "Barcelona", image: "https://cdn2.veltra.com/ptr/20170621112151_1200105813_12999_0.jpg?imwidth=550&impolicy=custom"},
    {name: "Lisbon", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT32TAzAtkmKD1vcT5CqU-cvCm7-lro3Z_5FylrUazO3ePJC3bl"},
    {name: "Amsterdam", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Westerkerk_Amsterdam.jpg/220px-Westerkerk_Amsterdam.jpg"},
    {name: "London", image: "https://cdn.londonandpartners.com/visit/general-london/areas/river/76709-640x360-houses-of-parliament-and-london-eye-on-thames-from-above-640.jpg"},
    {name: "Buenos Aires", image: "https://media.sandiegoreader.com/img/croppedphotos/2018/07/08/buenos_aires_argentina_1_t658.png?ff95ca2b4c25d2d6ff3bfb257febf11d604414e5"}
];*/



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Has Started!");
});