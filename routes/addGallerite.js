/* THIS ROUTE HANDLES ADDING A GALLERITE. */
var express = require("express");
var bodyParser = require("body-parser");
var parser = bodyParser.urlencoded({extended: false});
var valid = require("url-valid");
var mongodb = require("mongodb");
var dotenv = require("dotenv");
dotenv.config();

var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/")
.get(function(req, res) {
	/* If the page was open for a while, upon refresh it will display an error because the session would've timed out. If that happens, the user is redirected to the home page. */
	if (req.user) {
		/* message is undefined since at this point no message is shown. */
		res.render("addGallerite.ejs", {user: req.user, message: undefined});
	} else {
		res.redirect("/");
	}
})

.post(parser, function(req, res) {
	/* The link the user entered is validated. */
	valid(req.body.link, function(err, valid) {
		/* If the link is not valid, the page re-renders with an error message. */
		if (!valid) {
			res.render("addGallerite.ejs", {user: req.user, message: "The URL you entered is not valid. Please enter a valid one."});
		/* If the link is valid, process resumes. */
		} else {
			MongoClient.connect(mongoUrl, function(err, db) {
				if (err) {
					res.end("Error contacting database");
					return
				}
				/* The tags the user entered are saved to be edited. */
				var enteredTags = req.body.tags;
				/* Tags are aplit into an array. Split points are commas. */
				enteredTags = enteredTags.split(",");
				/* Each tag in enteredTags is switched to lower case, then trim is used to remove spaces at the begginning and end of the string. Finally, each space (which should be within the string) is replaced by a hyphen. */
				for (var tag in enteredTags) {
					enteredTags[tag] = enteredTags[tag].toLowerCase();
					enteredTags[tag] = enteredTags[tag].trim();
					enteredTags[tag] = enteredTags[tag].replace(" ", "-");
				}

				var gallerites = db.collection("gallerites");
				var users = db.collection("users");
				/* Tracking variables to check whether the gallerites and users collections have been updated. */
				var galleritesUpdated = false;
				var usersUpdated = false;
				/* Each gallerite is assigned a serial number. The new gallerite will have s serial number which is equal to highest exisiting serial number plus one. (could've used objectId which is created automatically by mongo) */
				gallerites.find({}).sort({"serialNumber": -1}).toArray(function(err, results) {
					/* The if statement assigns the serial number. 1 if there are no gallerites. */
					if (results.length == 0) {
						var serialNumber = 1;
					} else {
						var serialNumber = results[0].serialNumber + 1;
					}
					/* If the gallerite is a youtube gallerite, the link needs to be edited to work propoerly as embedded video. */
					if (req.body.type == "youtube") {
						/* A part of the link is replaced. */
						var link = req.body.link.replace("watch?v=", "embed/");
						/* "&t=" is a time paramter in the link. It appears if the user opened a link they previoiusly started to watch. It must be removed from the link. slice is used for that. The following if statement decides the index at which slice should stop. */
						if (link.indexOf("&t=") == -1) {
							/* If no time parameter exists in the link. slice would just start from 0 and end at the end of the string. Meaning nothing is removed from the link. */
							var endPoint = link.length
						} else {
							/* If the time parameter exists, its index is determined. */
							var endPoint = link.indexOf("&t=")
						}
						/* slice removed the time parameter if it exists. */
						link = link.slice(0, endPoint);
					/* If the gallerite type is not youtube, link saved as is. */
					} else {
						var link = req.body.link;
					}
					/* Gallerite is inserted into database. */
					gallerites.insert({
						"serialNumber": serialNumber,
						"type": req.body.type,
						"url": link,
						/* User object provided by passport-twitter strategy. */
						"addedBy": {"userId": req.user.id, "name": req.user._json.name, "imageLink": req.user._json.profile_image_url_https},
						"description": req.body.description,
						"likedBy": [],
						"tags": enteredTags
					}, function() {
						/* When gallerite is inserted, its tracking variable set to true and responseReady function runs to check if the repopnse is to be sent. */
						galleritesUpdated = true;
						responseReady(res, galleritesUpdated, usersUpdated);
					});
					/* The user is looked up in the databse. Each user adding a gallerite will stored in the databse. */
					users.find({"userId": req.user.id}).toArray(function(err, result) {
						if (result.length == 0) {
							/* If the user is not in the database, the information are inserted. */
							users.insert({
								"userId": req.user.id,
								"name": req.user._json.name,
								"imageLink": req.user._json.profile_image_url_https,
							}, function() {
								/* Tracking variable set to true and responseReady is run. */
								usersUpdated = true;
								responseReady(res, galleritesUpdated, usersUpdated);
							});
						} else {
							/* If the user is already in the database, nothing is inserted in the users colleciton. */
							usersUpdated = true;
							responseReady(res, galleritesUpdated, usersUpdated);
						}
					});
				})
			});
		}
	});
})
/* This function checks if all collections have been updated and then sends reponse. */
function responseReady(res, galleritesUpdated, usersUpdated) {
	/* If both collections are updated, user is redirected to the homepage. */
	if (galleritesUpdated && usersUpdated) {
		res.redirect("/");
		return;
	} else {
		return;
	}
}

module.exports = router;