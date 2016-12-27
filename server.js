var express = require("express");
var secure = require("express-force-https");
var ejs = require("ejs");

var app = express();
app.use(secure);

app.use("/stylesheets", express.static(__dirname + "/views/stylesheets"));
app.use("/scripts", express.static(__dirname + "/views/scripts"));

var home = require("./routes/home");
app.use("/", home);

var port = Number(process.env.PORT || 8080);
app.listen(port);