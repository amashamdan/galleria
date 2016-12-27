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
		router.route("/")
		.get(function(req, res) {
			gallerites.find({}).toArray(function(err, results) {
				res.render("index.ejs", {user: undefined, gallerites: results});
			});
		});
	}
});

module.exports = router;