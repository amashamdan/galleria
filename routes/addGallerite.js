var express = require("express");
var bodyParser = require("body-parser");
var parser = bodyParser.urlencoded({extended: false});
var valid = require("url-valid");
var mongodb = require("mongodb");

var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/")
.get(function(req, res) {
	if (req.user) {
		res.render("addGallerite.ejs", {user: req.user, message: undefined});
	} else {
		res.redirect("/");
	}
})

.post(parser, function(req, res) {
	valid(req.body.link, function(err, valid) {
		if (!valid) {
			res.render("addGallerite.ejs", {user: req.user, message: "The URL you entered is not valid. Please enter a valid one."});
		} else {
			MongoClient.connect(mongoUrl, function(err, db) {
				if (err) {
					res.end("Error contacting database");
					return
				}
				var gallerites = db.collection("gallerites");
				gallerites.insert({
					"type": req.body.type,
					"url": req.body.link,
					"addedBy": req.user._json.name,
					"addedById": req.user.id,
					"addedByImage": req.user._json.profile_image_url_https,
					"description": req.body.description,
					"likes": 0,
					"likedBy": []
				}, function() {
					res.redirect("/");
				});
			});
			
		}
	});
})

module.exports = router;