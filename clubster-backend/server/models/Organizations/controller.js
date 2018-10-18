/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

// Import 
const Organizations = require('./model');


exports.getAllClubs = (req, res) => {
	// Code to display all the clubs in out Mongo Collection
	Organizations.find().then((organizations) => {
		if (!organizations)
		{
			return res.status(400).json({'Error':'No organizations found'});
		}

		else{
			return res.status(201).json({'organizations': organizations});
		}
	});

}
