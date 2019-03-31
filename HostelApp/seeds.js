var mongoose=require("mongoose");
var Hostel=require("./models/hostel");
var Comment=require("./models/comment");

    
function seedDB(){
   //Remove all hostels
   Hostel.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed hostels!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            
             //add a few default hostels
            data.forEach(function(seed){
                Hostel.create(seed, function(err, hostel){
                if(err){
                        console.log(err)
                    } else {
                        console.log("added a hostel");
                        //create a comment
                        Comment.create(    //hemen altına yorum create for all of emtouch
                       {
                        text: "This place is great, but I wish there was TOilet",
                            author: "Homiee"
                        }, function(err, comment){
                            if(err){
                            console.log(err);
                                } else {
                             hostel.comments.push(comment);
                            hostel.save();
                            console.log("Created new comment");
                                }
                            });
                    }
                });
            });
});
});
}


module.exports=seedDB;
