var express = require("express");
var mongodb = require("mongodb");
var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/:userId")
.get(function(req, res) {
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
		var addedFound = false;
		var likedFound = false;
		var galleriaUserFound = false;
		var likedGallerites = [];
		var addedGallerites = [];
		var galleriaUser;

		users.find({"userId": req.params.userId}).toArray(function(err, result) {
			galleriaUser = result[0];
			galleriaUserFound = true;
			responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
		});

		gallerites.find({"addedBy.userId": req.params.userId}).toArray(function(err, results) {
			if (results.length == 0) {
				addedFound = true;
				responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
			} else {
				addedFound = true;
				addedGallerites = results;
				responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
			}
		});

		gallerites.find({"likedBy": req.params.userId}).toArray(function(err, results) {
			if (results.length == 0) {
				likedFound = true;
				responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
			} else {
				for (var result in results) {
					if (results[result].addedBy.userId != req.params.userId) {
						likedGallerites.push(results[result]);
					}
				}
				likedFound = true;
				responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites);
			}
		})

	})
});

function responseReady(res, addedFound, likedFound, galleriaUserFound, galleriaUser, user, likedGallerites, addedGallerites) {
	if (addedFound && likedFound && galleriaUserFound) {
		res.render("user.ejs", {user: user, galleriaUser: galleriaUser, likedGallerites: likedGallerites, addedGallerites: addedGallerites});
	}
}

module.exports = router;