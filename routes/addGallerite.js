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
				var users = db.collection("users");
				var galleritesUpdated = false;
				var usersUpdated = false;

				gallerites.find({}).sort({"serialNumber": -1}).toArray(function(err, results) {
					var serialNumber = results[0].serialNumber + 1;

					if (req.body.type == "youtube") {
						var link = req.body.link.replace("watch?v=", "embed/");
					} else {
						var link = req.body.link;
					}

					gallerites.insert({
						"serialNumber": serialNumber,
						"type": req.body.type,
						"url": link,
						"addedBy": {"userId": req.user.id, "name": req.user._json.name, "imageLink": req.user._json.profile_image_url_https},
						"description": req.body.description,
						"likedBy": []
					}, function() {
						galleritesUpdated = true;
						responseReady(res, galleritesUpdated, usersUpdated);
					});

					users.find({"userId": req.user.id}).toArray(function(err, result) {
						if (result.length == 0) {
							users.insert({
								"userId": req.user.id,
								"name": req.user._json.name,
								"imageLink": req.user._json.profile_image_url_https,
							}, function() {
								usersUpdated = true;
								responseReady(res, galleritesUpdated, usersUpdated);
							});
						} else {
							usersUpdated = true;
							responseReady(res, galleritesUpdated, usersUpdated);
						}
					});
				})
			});
		}
	});
})

function responseReady(res, galleritesUpdated, usersUpdated) {
	if (galleritesUpdated && usersUpdated) {
		res.redirect("/");
		return;
	} else {
		return;
	}
}

module.exports = router;