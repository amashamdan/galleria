var express = require("express");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;

var router = express.Router();

var lastPage;

router.route("/")
.get(savePage, passport.authenticate('twitter'));

router.route("/return")
.get(passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
    res.redirect(lastPage);
  });

router.route("/logout")
.get(savePage, function(req, res) {
	req.logout();
	res.redirect(lastPage);
});

function savePage(req, res, next) {
	lastPage = req.header("Referer");
	next();
}

module.exports = router;