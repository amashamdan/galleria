var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var parser = bodyParser.urlencoded({extended: false});

var router = express.Router();
var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

MongoClient.connect(mongoUrl, function(err, db) {
	router.route("/")
	.post(parser, function(req, res) {
		var entry = req.body.input;
		getData(req, res, db, entry);
	})

	router.route("/:entry")
	.get(function(req, res) {
		var entry = req.params.entry;
		getData(req, res, db, entry)
	})
});

function getData(req, res, db, entry) {
	if (!req.user) {
		var user = undefined;
	} else {
		var user = req.user;
	}
	var gallerites = db.collection("gallerites");
	var formattedEntry = entry.toLowerCase();
	formattedEntry = entry.replace(" ", "-");

	gallerites.find({}).toArray(function(err, documents) {
		var fullResults = [];
		var partialResults = [];

		for (var item in documents) {
			for (var tag in documents[item].tags) {
				if (documents[item].tags[tag] == formattedEntry) {
					fullResults.push(documents[item]);
					// Break to skip to next document. Because the next tag might match the entry which can lead to duplication.
					break;
				} else if (documents[item].tags[tag].indexOf(formattedEntry) != -1 && documents[item].tags[tag].indexOf(formattedEntry) != 0) {
					partialResults.push(documents[item]);
					break;
				} else if (documents[item].tags[tag].indexOf(formattedEntry) == 0 && formattedEntry.length < documents[item].tags[tag].length) {
					partialResults.push(documents[item]);
					break;
				}
			}
		}

		res.render("search.ejs", {user: user, gallerites: fullResults, entry: entry, partialGallerites: partialResults});
	});
}

module.exports = router;

