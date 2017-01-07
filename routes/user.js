/* HANDLES REQUESTING A USER'S PAGE. */
var express = require("express");
var mongodb = require("mongodb");
var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/:userId")
.get(function(req, res) {
	/* If no user is logged in, user is set to undefined. */
	if (!req.user) {
		var user = undefined;
	} else {
		var user = req.user;
	}
	
	MongoClient.connect(mongoUrl, function(err, db) {
		if (err) {
			res.end("Error connecting to database.");
			return
		}
		var users = db.collection("users");
		var gallerites = db.collection("gallerites");
		/* Three tracking variables to check if added gallerites, liked gallerites and the user's document have been loaded. */
		var addedFound = false;
		var likedFound = false;
		var galleriaUserFound = false;
		/* Variables where liked and added gallerites and the user's information will be stored. */
		var likedGallerites = [];
		var addedGallerites = [];
		var galleriaUser;
		/* First, the user is looked up using the userId which is passed as parameter in the url. */
		users.find({"userId": req.params.userId}).toArray(function(err, result) {
			/* Only 1 result should be returned and is saved on galleriaUser. */
			galleriaUser = result[0];
			/* Tracking variable set to true and responseReady is ran. */
			galleriaUserFound = true;
			responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
		});
		/* Next, the gallerites added by the user are found. */
		gallerites.find({"addedBy.userId": req.params.userId}).toArray(function(err, results) {
			/* Tracking variable set to true. */
			addedFound = true;
			/* gallerites saved. */
			addedGallerites = results;
			/* response Ready is ran. */
			responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
		});
		/* Finally, liked gallerites are lookedup. */
		gallerites.find({"likedBy": req.params.userId}).toArray(function(err, results) {
			/* If the user hasn't liked any gallerites, tracking variable set to true and reponseReady called. */
			if (results.length == 0) {
				likedFound = true;
				responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
			} else {
				/* If the user liked gallerites, those added by other users will be saved. */
				for (var result in results) {
					if (results[result].addedBy.userId != req.params.userId) {
						likedGallerites.push(results[result]);
					}
				}
				/* Tracking variable set to true and responseReady ran. */
				likedFound = true;
				responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
			}
		})

	})
});
/* Checks if all tracking variables are true, and renders users.ejs if response is ready. */
function responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites) {
	if (addedFound && likedFound && galleriaUserFound) {
		res.render("user.ejs", {user: user, galleriaUser: galleriaUser, likedGallerites: likedGallerites, addedGallerites: addedGallerites});
	}
}

module.exports = router;