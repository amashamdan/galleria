/* THIS ROUTE HANDLES REQUESTS TO HOME PAGE, AND LIKING AND UNLIKING A GALLERITE. */
var express = require("express");
var mongodb = require("mongodb");
var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

MongoClient.connect(mongoUrl, function(DBerr, db) {
	// if (err) {
		// res.end("Error in contacting database");
	// } else {
		var gallerites = db.collection("gallerites");
		var users = db.collection("users");

		router.route("/")
		.get(function(req, res) {
			if (DBerr) {
				res.end("Error in contacting database");
				return;
			}
			/* All gallerites are loaded and index.ejs is rendered. */
			gallerites.find({}).toArray(function(err, results) {
				res.render("index.ejs", {user: req.user, gallerites: results});
			});
		});
		/* This route is called when a user hits the like or unlike button. */
		router.route("/action/:serialNumber")
		.post(function(req, res) {
			if (DBerr) {
				res.end("Error in contacting database");
				return;
			}
			/* If the button pressed was like: */
			if (req.body.action == "like") {
				/* The gallerite is looked up using serial number which is passed a parameter in the url, the user's id is added to the likedBy array. */
				gallerites.update(
					{"serialNumber": Number(req.params.serialNumber)},
					{"$addToSet": {"likedBy": req.user.id}},
					function() {
						/* When the gallerite is updated, it is checked to see if the user is in the users colleciton. */
						users.find({"userId": req.user.id}).toArray(function(err, results) {
							/* If the user is not found, the user is inserted to the users collection. */
							if (results.length == 0) {
								users.insert({
									"userId": req.user.id,
									"name": req.user._json.name,
									"imageLink": req.user._json.profile_image_url_https,
								}, function() {
									/* When user is inserted, 200 status is sent to the client. */
									res.status(200);
									res.end();									
								});
							/* If The usere is found, status 200 is sent directly. */
							} else {
								res.status(200);
								res.end();
							}
						})
					}
				);
			/* If the user pressed unlike */
			} else if (req.body.action == "unlike") {
				/* The user's id is removed from the likedBy array. */
				gallerites.update(
					{"serialNumber": Number(req.params.serialNumber)},
					{"$pull": {"likedBy": req.user.id}},
					function() {
						/* When done, status 200 is sent to the client. */
						res.status(200);
						res.end();
					}
				);				
			}
		});
	// }
});

module.exports = router;