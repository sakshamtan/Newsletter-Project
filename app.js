//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); 
// to serve static files(images, stylesheets) to our server we use static fuction
// The public folder is the folder that will be served up so keep all static files in public folder
// The path in our applications refering to static files should be relative to this folder as public ke andar to server slready hoga

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res){
    res.redirect("/"); // redirect to home page on failure (try again button functionality failure page)
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [ // format accepted by mailchimp api
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }    
            }
        ]
    };

    const jsonData = JSON.stringify(data); // mailchimp accepts data in json

    // us13 -> server number and a9dc0c1ebe -> audience id (added to the url)
    const url = "https://us8.api.mailchimp.com/3.0/lists/a9dc0c1ebe" 
    const options = {
        method: "POST",
        auth: "saksham:59e10a309ea45bd2d92e29ddf9c5418b-us8" // authentication for POST request -> username : key(password)
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });

        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function(){ // heroku will dynamically allocate port but for local testing it is 3000
    console.log("Server running at port 3000");
});

// api key
// 59e10a309ea45bd2d92e29ddf9c5418b-us8
// audience id 
// a9dc0c1ebe
// url
// "https://usX.api.mailchimp.com/3.0/lists"