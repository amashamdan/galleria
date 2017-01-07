/* THIS ROUTE HANDLES DELETING A GALLERITE. */
var express = require("express");
var mongodb = require("mongodb");

var router = express.Router();

var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.GALLERIA;

router.route("/:serialNumber")
.post(function(req, res) {
	MongoClient.connect(mongoUrl, function(err, db) {
		if (err) {
			res.end("Error connecting to database.");
			return;
		}

		var gallerites = db.collection("gallerites");
		/* Gallerite is looked up and removed. */
		gallerites.remove({"serialNumber": Number(req.params.serialNumber)}, function() {
			/* A status 200 is sent to the client. */
			res.status(200);
			res.end();
		});
	});
});

module.exports = router;