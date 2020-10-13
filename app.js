// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = "c2f8f0a2400229a517ed95d91d10c564";
  const unit = "metric";
  const url = "http://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
  http.get(url, function(response) {
    if (response.statusCode !== 200)
    {
      res.sendFile(__dirname + "/failure.html");
    }
    else
    {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      // console.log(weatherData);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      imgSrc = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.setHeader("Content-Type", "text/html");
      // console.log("Temperature: " + temp);
      // console.log("Description: " + weatherDescription);
      res.write("<h3>The weather is currently " + weatherDescription + ".</h3>");
      res.write("<h1>The Temperature in " + query + " is " + temp + " degrees celcius.</h1>");
      res.write("<img src=" + imgSrc + ">");
      res.send();
    });
  }
  });
});
app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started at port 3000");
});
