/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

// Import
const Organization = require('./model');


exports.getAllClubs = (req, res) => {
	// Code to display all the clubs in our Mongo Collection
	Organization.find().then((organizations) => {
		if (!organizations)
		{
			return res.status(400).json({'Error':'No organizations found'});
		}
		else{
			return res.status(201).json({'organizations': organizations});
		}
	});

};

exports.addOrg = (req, res) => {
	// Code to add a new organization to the Mongo Collection

	// Destruct req body
	const{ name, president, acronym, admins, description} = req.body;
	// If user supplied these fields
	if(name && president && acronym && description) {
		// Check if organization with these key-value pairs already exists
		Organization
			.findOne( {name: name} )
			.exec(function(err, organization){
				if(organization){
					return res.status(400).json({'Error': 'Organization already exists'});
				}
				else{
					// Make new organization and save into the Organizations Collection
					let newOrg = new Organization({
						name: name,
						president: president,
						acronym: acronym,
						admins: admins,
						description: description
					});
	 				newOrg.save().then(organization => {
						res.status(201).json(organization);
					}).catch(err => console.log(err)); // Push the new user onto the db if successful, else display error


				}
		})
	}
	else {
		console.log(President);
		return res.status(201).json({'Error': 'Error'});
	}

};
