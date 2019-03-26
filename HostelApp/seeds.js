var mongoose = require("mongoose");
var Hostel = require("./models/hostel");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm4.staticflickr.com/3859/15123592300_6eecab209b.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
];

function seedDB(){
    //remove all dest
    Hostel.remove({},function(err){
        if(err){
       console.log(err);
        }
        console.log("removed all hostels");
        
        //add a few hostels
        data.forEach(function(seed){
        
        Hostel.create(seed,function(err,hostel){
        if(err){
            console.log(err);
        } else {
            console.log("added new hostel");
        //create new comment
        Comment.create(
            {
                text:"It serves free breakfast",
                author:"Nomat"
            },function(err,comment){
                if(err){
                    console.log(err);
                }else {
                hostel.comments.push(comment);
                hostel.save();
                console.log("created new comment");
                }
            });
        }       
            });
        });
    });
}


module.exports=seedDB;