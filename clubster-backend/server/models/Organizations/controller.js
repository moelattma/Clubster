// Organizations controller
/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

const Organization = require('./model');
const User = require('../Users/model');
const Notification = require('../Notifications/model');
const Galleries = require('../Galleries/model');
const mongoose = require('mongoose');

/* To get the current user's profile, do not pass in a profileID to the body
 * To get a particular profile, pass in the user profile's _id to route
 */
exports.getUserClubs = (req, res) => {
	const userID = req.body.profileID ? req.body.profileID : req.user._id;

	User.findOne({ _id: userID }).select("arrayClubsAdmin arrayClubsMember").populate({ path: 'arrayClubsAdmin', select: "image name _id" })
		.populate({ path: 'arrayClubsMember', select: 'image name _id' }).then((user) => {
			return res.status(201).json({ 'arrayClubsAdmin': user.arrayClubsAdmin, 'arrayClubsMember': user.arrayClubsMember });	//populates array that user is admin of
		}).catch((err) => console.log(err));
};


// Display all the clubs in our Mongo Collection
exports.getAllClubs = (req, res) => {
	Organization.find().select("_id name description president image").then((organizations) => {
		if (!organizations) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			return res.status(201).json({ 'organizations': organizations });
		}
	});
};

exports.isMember = (req, res) => {
	const { orgID } = req.body;
	let userID = req.user._id;

	Organization.findByIdAndUpdate(orgID).then((organization) => {
		if (!organization)
			return res.status(400).json({ 'Error': 'No organization found' })
		const { members } = organization;
		var isMember = false;
		members.forEach(element => {
			if (userID.equals(element.member)) isMember = true;
		});
		if (!isMember) {
			Notification.findOne({ $and: [{ idOfSender: req.user._id }, { idOfOrganization: orgID }, { $or: [{ type: "ORG_JOIN_ADMIN" }, { type: "ORG_JOIN_MEMBER" }] }] }).then((notification) => {
				return res.status(201).json({ 'isMember': (notification && notification.isActive), 'organization': organization });
			})
		} else return res.status(201).json({ 'isMember': isMember, 'organization': organization });
	});
}

exports.deleteClubMember = (req, res) => {
	const { orgID, memberID } = req.params;

	// finds and return organization id of specific club
	Organization.findByIdAndUpdate(orgID).then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			Organization.deleteClubMember(orgID, memberID);
			User.removeClubMember(orgID, memberID);
			return res.status(201).json({ 'organization': organization });
		}
	});
}

exports.getMembers = (req, res) => {
	// Destruct req body ( pull the values to the assign keys)
	const { orgID } = req.params;

	// finds and return organization id of specific club
	Organization.findByIdAndUpdate(orgID, 'members admins president')
	.populate('members.member', 'name image _id' ).populate('admins.admin', 'name image _id' )
	.then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			User.findOne({ name: organization.president }).then((president) => {
				if (president)
					return res.status(201).json({ 'members': organization.members, 'admins': organization.admins, 'idOfUser': req.user._id, 'president': president._id });
			});
		}
	});
}

exports.addOrg = (req, res) => {
	// Code to add a new organization to the Mongo Collection

	// Destruct req body
	const { name, description, imageURL } = req.body;
	User.findByIdAndUpdate(req.user._id).then((user) => {
		const president = user.name;

		// Check if organization with these key-value pairs already exists
		if (name && description) {
			Organization.findOne({ name: name }).then((organization) => {
				if (organization) {
					return res.status(400).json({ 'Error': 'Organization already exists' });
				} else {
					let newGallery = new Galleries({
						photos: []
					})

					newGallery.save().then(newGal => {
						// Make new organization and save into the Organizations Collection
						let newOrg = new Organization({
							name: name,
							president: president,
							admins: [],
							description: description,
							image: imageURL,
							gallery: newGal._id
						});

						newOrg.save().then((organization) => {
							User.clubAdminPushing(organization._id, user._id);
							Organization.addAdminToClub(organization._id, req.user._id);
							if (organization) {
								Organization.findOne({ _id: organization._id }).then((newOrganization) => {
									if (!newOrganization) {
										return res.status(400).json({ 'Error': 'No organizations found' });
									} else {
										return res.status(201).json({ 'organization': newOrganization });
									}
								});
							}
						}).catch((err) => { console.log(err); return res.status(400).json({ 'Error': err }) });
					// Push the new user onto the db if successful, else display error
					})
				}
			}).catch(err => console.log(err));
		}
		else {
			return res.status(400).json({ 'Error': 'Error' });
		}
	});
};

exports.retrieveOrg = (req, res) => {
	const { orgID } = req.params;
	Organization.findByIdAndUpdate(orgID).then(organization => {
		if (organization && !organization.gallery) {
			let newGallery = new Galleries({
				photos: []
			});
			newGallery.save().then(newGal => {
				organization.gallery = newGal._id;
				organization.save();
			})
		}
	});

	Organization.findOne({ _id: orgID }).populate('gallery')
	.populate({ path: 'events', populate: { path: 'host', select: 'name image _id' } })
	.populate('members.member', 'name image _id' )
	.populate('admins.admin', 'name image _id' )
	.then((organization) => {
		if (organization)
			return res.status(201).json({ 'org': organization });
		else
			return res.status(400).json({ 'err': 'err' });
	});
};

exports.updateOrg = (req, res) => {
	const { orgID } = req.params;
	const { name, description } = req.body;

	Organization.findById(orgID).then((organization) => {
		if (organization) {

			let updatedOrg = {
				name: name,
				president: organization.president,
				description: description
			};

			Organization.findByIdAndUpdate(
				mongoose.Types.ObjectId(orgID),
				{ $set: updatedOrg },
				{ new: true }
			).then((organization) => {
				Organization.findById(organization._id).populate('image').then((organization) => {
					if (organization)
						return res.status(201).json({ 'organization': organization });
					else
						return res.status(400).json({ 'err': 'err' })
				}).catch(err => console.log(err));
			})
		}
		else {
			return res.status(400).json({ 'err': 'err' })
		}

	}).catch(err => console.log(err));
};

exports.changeClubPicture = (req, res) => {
	Organization.findOneAndUpdate({ _id: req.params.orgID }, { $set: { "image": req.body.imageURL } }).then((organization) => {
		if (!organization) {
			return res.status(404).json({ 'Error': 'error', 'image': null });
		} else {
			return res.status(201).json({ 'image': req.body.imageURL });
		}
	});
};
