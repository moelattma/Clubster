/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

// Import 
const Organizations = require('./model');


exports.getAllClubs = (req, res) => {
	// Code to display all the clubs in our Mongo Collection
	Organizations.find().then((organizations) => {
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
	const{President, VicePresident, Treasurer, Secretary, EventsChair, CommunicationsChair, WebMaster, description, social} = req.body;
	// If user supplied these fields
	if(President && VicePresident && Treasurer && Secretary && description) {
		// Check if organization with these key-value pairs already exists
		Organizations.findOne( { $and: [
			{President: President},
			{VicePresident: VicePresident},
			{Treasurer: Treasurer},
			{Secretary: Secretary},
			{description: description}]
		}).exec(function(err, organization){
			if(organization){
				return req.status(400).json({'Error': 'Organization already exists'});
			}
			else{
				// Make new organization and save into the Organizations Collection
				let newOrg = {
					President: President,
					VicePresident: VicePresident,
					Treasurer: Treasurer,
					Secretary: Secretary,
					EventsChair: EventsChair,
					CommunicationsChair: CommunicationsChair,
					WebMaster: WebMaster,
					description: description
				};
 				newOrg.save().then(organization => res.json(organization).catch(err => console.log(err))); // Push the new user onto the db if successful, else display error

				return req.status(201).json(newOrg);
			}
		})


		return res.status(201).json({'Success': 'Success'});
	}
	else {
		console.log(President);
		return res.status(201).json({'Error': 'Error'});
	}

};

