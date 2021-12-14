//jshint esversion:6
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); //server无法提取本地的文件，解决：放在public文件夹下
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/e6c65027ef";

  const options = {
    method: "POST",
    auth: "chenyu:9ced65969b0f49ccb88e8da2d824768-us20"
  };

  const request = https.request(url, options, function(response){
    if(response.statusCode===200)
    {
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });



  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

//process.env.PORT:动态监听heroku的port 本地识别不了
app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port 3000");
});




//api key
// 1923dc6f5aa3758a3918ab800dd693f2b-us20

//list id Audience id
// e6c65027ef
