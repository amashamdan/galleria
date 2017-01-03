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

		gallerites.remove({"serialNumber": Number(req.params.serialNumber)}, function() {
			res.status(200);
			res.end();
		});
	});
});

module.exports = router;