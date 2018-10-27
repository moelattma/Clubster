/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

// Import
const Organization = require('./model');
const User = require('../Users/model');


exports.getUserClubs = (req, res) => {
	console.log(req.body._id);
	User.findOne({id:req.body._id}).populate('arrayClubsAdmin').then((user) => {
		console.log(req.body._id);
		return res.status(201).json({'user': user});	//populates array that user is admin of
	}).catch((err) => console.log(err));
};

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
		Organization.findOne({name: name})
			.then((organization) => {
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
						admins.forEach(function(admin) {
							User.clubAdminPushing(admin, organization._id);
						});
						return res.status(201).json(organization);
					}); // Push the new user onto the db if successful, else display error
				}
		}).catch(err => console.log(err));
	}
	else {
		return res.status(201).json({'Error': 'Error'});
	}

};
