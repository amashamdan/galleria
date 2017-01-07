/* THIS ROUTE HANDLES SEARCH. */
var express = require("express");
var mongodb = require("mongodb");
var bodyParser = require("body-parser");
var parser = bodyParser.urlencoded({extended: false});

var router = express.Router();
var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

/* Search can be initiated by a post request (filling the search form) or by a get request (clicking on a tag). In both cases, the tag is saved and function getData is ran. */
MongoClient.connect(mongoUrl, function(err, db) {
	router.route("/")
	.post(parser, function(req, res) {
		/* With post request, entry is extracted from request's body. */
		var entry = req.body.input;
		getData(req, res, db, entry);
	})

	router.route("/:entry")
	.get(function(req, res) {
		/* In get requests, entry is extracted from the url. */
		var entry = req.params.entry;
		getData(req, res, db, entry)
	})
});

/* The function looks in the database from matches of the performed search and sends response. */
function getData(req, res, db, entry) {
	/* If no user is logged in. user is set to undefined. */
	if (!req.user) {
		var user = undefined;
	} else {
		var user = req.user;
	}
	var gallerites = db.collection("gallerites");
	/* The entry is formatted like the saved tags, lower cased and spaces replaced with hyphens. */
	var formattedEntry = entry.toLowerCase();
	formattedEntry = entry.replace(" ", "-");
	/* All gallerites are retreived from the database. */
	gallerites.find({}).toArray(function(err, documents) {
		/* Full matches with the entry will be stored in fullResults while partial matches will be in partialResults. */
		var fullResults = [];
		var partialResults = [];
		/* Each document (gallerite) is looped through. */
		for (var item in documents) {
			/* The tags array for each gallerite is looped through. */
			for (var tag in documents[item].tags) {
				if (documents[item].tags[tag] == formattedEntry) {
					/* If the entry fully matches a tag, the gallerite is saved into fullResults array. */
					fullResults.push(documents[item]);
					// Break to skip to next document. Because the next tag might match the entry which can lead to duplication.
					break;
				} else if (documents[item].tags[tag].indexOf(formattedEntry) != -1 && documents[item].tags[tag].indexOf(formattedEntry) != 0) {
					/* If the entry matches a part of the tag's string and the matched part is not at the beginning of the matched tag, this represents a partial match. And the gallerite is moved to partialResults. */
					partialResults.push(documents[item]);
					break;
				} else if (documents[item].tags[tag].indexOf(formattedEntry) == 0 && formattedEntry.length < documents[item].tags[tag].length) {
					/* Finally, If the entry partially matches a tag's string, and the entry starts at the 0 index of the matched tag, and if the length of the entry is less than that of the matched tag, this represents a partial match. And the gallerite is moved to partialResults. */
					partialResults.push(documents[item]);
					break;
				}
			}
		}
		/* search.ejs is rendered. */
		res.render("search.ejs", {user: user, gallerites: fullResults, entry: entry, partialGallerites: partialResults});
	});
}

module.exports = router;

