var express = require("express");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;

var router = express.Router();

router.route("/")
.get(passport.authenticate('twitter'));

router.route("/return")
.get(passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
    res.redirect("/");
  });

module.exports = router;