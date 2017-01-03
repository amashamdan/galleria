var express = require("express");
var mongodb = require("mongodb");
var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

MongoClient.connect(mongoUrl, function(err, db) {
	if (err) {
		res.end("Error in contacting database");
	} else {
		var gallerites = db.collection("gallerites");
		var users = db.collection("users");

		router.route("/")
		.get(function(req, res) {
			gallerites.find({}).toArray(function(err, results) {
				res.render("index.ejs", {user: req.user, gallerites: results});
			});
		});

		router.route("/action/:serialNumber")
		.post(function(req, res) {
			if (req.body.action == "like") {
				gallerites.update(
					{"serialNumber": Number(req.params.serialNumber)},
					{"$addToSet": {"likedBy": req.user.id}},
					function() {
						res.status(200);
						res.end();
					}
				);
			} else if (req.body.action == "unlike") {
				gallerites.update(
					{"serialNumber": Number(req.params.serialNumber)},
					{"$pull": {"likedBy": req.user.id}},
					function() {
						res.status(200);
						res.end();
					}
				);				
			}
		});
	}
});

module.exports = router;