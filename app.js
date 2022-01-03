//Creating a News Letter Sign-Up web application project 

/* 
-Include npm --> npm init

-Install Express framework --> npm install express

-Install body-parser --> npm install body-parser

-run server with --> nodemon app.js  --> on web browser type "localhost:3000"

-API we are using to added our subcribers to their server to--> https://mailchimp.com/developer/ 
-After adding a user signup you can check your account "audience" > "all contacts" to see the user has subscribed in the list 
*/

const express = require("express");
const app = express(); 

const bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({extended: true}));

//when sendFile response also include CSS, images, or other assets in your "public" folder 
app.use(express.static("public")); 

//for get API request 
const https = require("https"); 

//creater server and listening at port 3000, but we want to deploy this web application on Heroku so we need to port
//at "process.env.PORT" per Heroku requirments, which is a dynamic port that Heroku uses
//To run this web application/server local then change the port to 3000, but if we use OR operator || then server will listen to either one
app.listen(process.env.PORT || 3000, function(){
    console.log("Server up and running ... Listening at port 3000");
}); 

//process GET request from client when access homepage of server 
app.get("/", function(request, response){
    response.sendFile(__dirname + "/signup.html"); 
}); 

//process POST data from client
app.post("/", function(request, response){
    const firstName = request.body.fName;
    const lastName = request.body.lName;
    const email = request.body.email;

    //we have to create a data object to pass to the API website, the object is written based on requirement of the website
    //this user will be added to the API's website server https://mailchimp.com/developer/ 
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }; 

    //converting Javascript Object into JSON format 
    const jsonData = JSON.stringify(data); 

    var audienceIDList = "fdf6023cff";

    //Note: "us20" is your API key server location, so check your API key 
    var url = "https://us20.api.mailchimp.com/3.0/lists/" + audienceIDList; 
    
    //way of sending the user data 
    var options = {
        method: "POST",
        auth: "Krittidet:699b34da6b6950ceca0aa35eabf98462-us20"
    }

    //request to send data to API website server to add the subscriber information to the list 
    const requestToAPIWebsite = https.request(url, options, function(res){
        
        //check status 
        if(res.statusCode === 200){
            response.sendFile(__dirname + "/success.html"); 
        }
        else{
            response.sendFile(__dirname + "/failure.html"); 
        }

        //access to see data sent information 
        res.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    //send the data to the API website Server 
    requestToAPIWebsite.write(jsonData); 
    requestToAPIWebsite.end(); 

});

//button Try Agian due to failure signup 
app.post("/failure", function(request, response){
    //redirect to homepage which will call the "app.get("/", function(....))" above 
    response.redirect("/"); 
});

//API key
//699b34da6b6950ceca0aa35eabf98462-us20

//Audience list ID (The list to put your subscribers into)
//fdf6023cff