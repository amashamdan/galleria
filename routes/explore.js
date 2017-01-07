/* THIS ROUTE HANDLES EXPLORING A GALLERITE (open a gallerite's page). */
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
		/* To render the explore.ejs file, a user variable is passed to the ejs file. It is set to undefined even if no user is logged in because if it wasn't defined, ejs file will throw an error. */
		if (!req.user) {
			var user = undefined;
		} else {
			var user = req.user;
		}

		var gallerites = db.collection("gallerites");
		var users = db.collection("users");
		/* The gallerites serial number which a paramter in the request url is used to find the gallerite in the databse. */
		gallerites.find({"serialNumber": Number(req.params.serialNumber)}).toArray(function(err, result) {
			/* Only one result should be returned and is saved into gallerite variable. */
			var gallerite = result[0];
			/* This varialbe stores information about the users who liked this gallerie. */
			var likeUsers = []; 
			/* If no users liked the gallerite, the response is sent directly. likeUsers will just be an empty array. */
			if (gallerite.likedBy.length == 0) {
				res.render("gallerite.ejs", {user: user, likeUsers: likeUsers, gallerite: gallerite});
			} else { 
				/* If users liked it, their userIds are used to find their information in the users collection. */
				for (var likeUser in gallerite.likedBy) {
					users.find({"userId": gallerite.likedBy[likeUser]}).toArray(function(err, result) {
						/* Each user is pushed to the likeUsers array. */
						likeUsers.push(result[0]);
						/* When the length of likeUsers equals gallerite.likedBy array, it means that all users have been added. gallerite.ejs is rendered. */
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