var express = require("express");
var mongodb = require("mongodb");
var router = express.Router();

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
			var addedFound = false;
			var likedFound = false;
			var likedGallerites = [];
			var addedGallerites = [];


			gallerites.find({"addedBy.userId": req.user.id}).toArray(function(err, results) {
				if (results.length == 0) {
					addedFound = true;
					responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
				} else {
					addedFound = true;
					addedGallerites = results;
					responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
				}
			});

			gallerites.find({"likedBy": req.user.id}).toArray(function(err, results) {
				if (results.length == 0) {
					likedFound = true;
					responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
				} else {
					for (var result in results) {
						if (results[result].addedBy.userId != req.user.id) {
							likedGallerites.push(results[result]);
						}
					}
					likedFound = true;
					responseReady(req, res, addedFound, likedFound, addedGallerites, likedGallerites);
				}
			})

		})
	}
});

function responseReady(req, res, addedFound, likedFound, gallerites, likedGallerites) {
	if (addedFound && likedFound) {
		res.render("myGallerites.ejs", {user: req.user, gallerites: gallerites, likedGallerites: likedGallerites});
	}
}

module.exports = router;