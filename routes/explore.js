var express = require("express");
var mongodb = require("mongodb");

var router = express.Router();
var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/:serialNumber")
.get(function(req, res) {
	MongoClient.connect(mongoUrl, function(err, db) {
		if (err) {
			res.end("Error connecting to database");
			return;
		} 

		if (!req.user) {
			var user = undefined;
		} else {
			var user = req.user;
		}

		var gallerites = db.collection("gallerites");
		var users = db.collection("users");

		gallerites.find({"serialNumber": Number(req.params.serialNumber)}).toArray(function(err, result) {
			var gallerite = result[0];
			var likeUsers = []; 

			if (gallerite.likedBy.length == 0) {
				res.render("gallerite.ejs", {user: user, likeUsers: likeUsers, gallerite: gallerite});
			} else { 

				for (var likeUser in gallerite.likedBy) {
					users.find({"userId": gallerite.likedBy[likeUser]}).toArray(function(err, result) {
						likeUsers.push(result[0]);
						if (likeUsers.length == gallerite.likedBy.length) {
							res.render("gallerite.ejs", {user: user, likeUsers: likeUsers, gallerite: gallerite});
						}
					});
				}
			}
		});
	})
});

module.exports = router;