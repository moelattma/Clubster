/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

const Organization = require('./model');
const User = require('../Users/model');
const Conversation = require('../Conversations/model');
exports.getUserClubs = (req, res) => {
	console.log(req.user._id);
	User.findOne({ _id: req.user._id }).populate('arrayClubsAdmin').then((user) => {
		console.log(req.body._id);
		return res.status(201).json({ 'user': user });	//populates array that user is admin of
	}).catch((err) => console.log(err));
};

// Display all the clubs in our Mongo Collection
exports.getAllClubs = (req, res) => {
	Organization.find().then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			return res.status(201).json({ 'organizations': organization });
		}
	});
};

// dummy method for adding members
exports.addMember = (req, res) => {
	const { idOfOrganization, idOfMember } = req.params;
	console.log(idOfOrganization, idOfMember);
	console.log(Organization);
	// finds and return organization id of specific club
	Organization.findOne({ _id: idOfOrganization }).then((organization) => {
		console.log(organization)
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			Organization.addMemberToClub(idOfOrganization, idOfMember);
			return res.status(201).json({ 'organization': organization });
		}
	});
}

exports.deleteClubMember = (req, res) => {
	const { idOfOrganization, idOfMember } = req.params;

	// finds and return organization id of specific club
	Organization.findOne({ _id: idOfOrganization }).then((organization) => {
		console.log(organization)
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		}
		else {
			Organization.deleteClubMember(idOfOrganization, idOfMember);
			return res.status(201).json({ 'organization': organization });
		}
	});
}

exports.getMembers = (req, res) => {
	// Destruct req body ( pull the values to the assign keys)
	const { idOfOrganization } = req.params;
	// finds and return organization id of specific club
	Organization.findOne({ _id: idOfOrganization }).populate('members').then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		}
		else {
			return res.status(201).json({ 'organization': organization });
		}
	});
}



exports.addOrg = (req, res) => {
	// Code to add a new organization to the Mongo Collection

	// Destruct req body
	const { name, president, acronym, admins, description, purpose } = req.body;
	console.log(name);
	// If user supplied these fields
	if (name && purpose && acronym && description) {
		// Check if organization with these key-value pairs already exists
		Organization.findOne({ name: name })
			.then((organization) => {
				if (organization) {
					return res.status(400).json({ 'Error': 'Organization already exists' });
				}
				else {
					// Make new organization and save into the Organizations Collection
					let newOrg = new Organization({
						name: name,
						president: req.user._id,
						acronym: acronym,
						admins: [],
						purpose: purpose,
						description: description
					});
					let chatRoom = new Conversation({
						idOfClub: newOrg._id
					});
					console.log(newOrg);
					newOrg.save().then((organization) => {
						console.log(organization);
						User.clubAdminPushing(req.user._id, organization);
						Organization.addAdminToClub(organization._id, req.user._id)
						chatRoom.save().then((chatRoom) => {
							if(organization && chatRoom) {
								return res.status(201).json(newOrg);
							}
						});
				}).catch((err) => {console.log(err); return res.status(400).json({'Error': err})}); // Push the new user onto the db if successful, else display error

				}
			}).catch(err => console.log(err));
	}
	else {
		return res.status(201).json({ 'Error': 'Error' });
	}
};
