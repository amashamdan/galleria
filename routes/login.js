/* THIS ROUTE HANDLES LOGIN AND LOGOUT. */
var express = require("express");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;

var router = express.Router();
/* This variable stores the page from which the login or logout was requested. The user will be redirected to this page after login or logout. */
var lastPage;

router.route("/")
/* Login request, runs savePage to store current page, and then runs authentication provided by passport.js. */
.get(savePage, passport.authenticate('twitter'));

/* This route is called upon succesfful login. */
router.route("/return")
.get(passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
    /* User is redirected to the last page. */
	res.redirect(lastPage);
});
/* With logout request, savePage is ran, user is logged out, and then redirected tothe same page. */
router.route("/logout")
.get(savePage, function(req, res) {
	req.logout();
	res.redirect(lastPage);
});
/* This function acts as middileware and saves the page the user was on. */
function savePage(req, res, next) {
	lastPage = req.header("Referer");
	next();
}

module.exports = router;