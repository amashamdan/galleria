var express = require("express");
var secure = require("express-force-https");
var ejs = require("ejs");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;

var app = express();
app.use(secure);

app.use("/stylesheets", express.static(__dirname + "/views/stylesheets"));
app.use("/scripts", express.static(__dirname + "/views/scripts"));

// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
	    consumerKey: process.env.CONSUMER_KEY,
	    consumerSecret: process.env.CONSUMER_SECRET,
	    callbackURL: "http://localhost:8080/login/return"
	},
	function(token, tokenSecret, profile, cb) {
	    // In this example, the user's Twitter profile is supplied as the user
	    // record.  In a production-quality application, the Twitter profile should
	    // be associated with a user record in the application's database, which
	    // allows for account linking and authentication with other identity
	    // providers.
		return cb(null, profile);
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

var home = require("./routes/home");
app.use("/", home);
var login = require("./routes/login");
app.use("/login", login);
var addGallerite = require("./routes/addGallerite");
app.use("/addGallerite", addGallerite);
var myGallerites = require("./routes/myGallerites");
app.use("/myGallerites", myGallerites);
var deleteGallerite = require("./routes/deleteGallerite");
app.use("/delete", deleteGallerite);
var user = require("./routes/user");
app.use("/user", user);
var explore = require("./routes/explore");
app.use("/explore", explore);
var search = require("./routes/search");
app.use("/search", search);

var port = Number(process.env.PORT || 8080);
app.listen(port);