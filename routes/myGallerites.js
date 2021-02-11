var express = require("express");
var mongodb = require("mongodb");
var router = express.Router();
var dotenv = require("dotenv");
dotenv.config();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/")
.get(function(req, res) {
	if (!req.user) {
		res.redirect("/");
	} else {
		MongoClient.connect(mongoUrl, function(err, db) {
			if (err) {
				res.end("Error connecting to database.");
				return
			}

			var gallerites = db.collection("gallerites");
			/* Tracking variables to check that gallerites the user added and the gallerites the user liked are loaded. */
			var addedFound = false;
			var likedFound = false;
			/* Two arrays will store the gallerites the user added and the gallerites the user liked are loaded. */
			var likedGallerites = [];
			var addedGallerites = [];
			/* First, the user's usrId is used to find the gallerites they added. */
			gallerites.find({"addedBy.userId": req.user.id}).toArray(function(err, results) {
				/* Tracking variable set to true. */
				addedFound = true;
				/* Results stored into addedGallerites array. */
				addedGallerites = results;
				/* responseReady function is ran. */
				responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
			});
			/* The userId is now used to find the gallerites they liked. */
			gallerites.find({"likedBy": req.user.id}).toArray(function(err, results) {
				if (results.length == 0) {
					/* If nothing is found, tracking variable set to true. */
					likedFound = true;
					/* responseReady is ran. */
					responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
				} else {
					/* If the user have liked gallerites, each one is checked to see if the same user added them (Only the gallerites added by other users to be displayed). */
					for (var result in results) {
						/* If the user who added the gallerite is different from the current user, the gallertite is pushed into the likedGallerites array. */
						if (results[result].addedBy.userId != req.user.id) {
							likedGallerites.push(results[result]);
						}
					}
					/* Tracking variable set to true and responseReady is ran. */
					likedFound = true;
					responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
				}
			})

		})
	}
});
/* The function checks and send repsonse to the client when all data are loaded. */
function responseReady(req, res, addedFound, likedFound, gallerites, likedGallerites) {
	/* If all tracking variables are true, myGallerites.ejs is rendered. */
	if (addedFound && likedFound) {
		res.render("myGallerites.ejs", {user: req.user, gallerites: gallerites, likedGallerites: likedGallerites});
	}
}

module.exports = router;