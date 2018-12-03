/*
* This is the controller for the Organizations schema.
* author: ayunus@ucsc.edu
*/

const Organization = require('./model');
const User = require('../Users/model');
const Img = require('../Images/model');
const Notification = require('../Notifications/model');
const fs = require('fs');
const mongoose = require('mongoose');


exports.getUserClubs = (req, res) => {
	User.findOne({ _id: req.user._id }).select("arrayClubsAdmin arrayClubsMember").populate({ path: 'arrayClubsAdmin', populate: { path: 'imageId' }, select: "imageId name _id" })
		.populate({ path: 'arrayClubsMember', populate: { path: 'imageId' }, select: 'imageId name _id' }).then((user) => {
			return res.status(201).json({ 'arrayClubsAdmin': user.arrayClubsAdmin, 'arrayClubsMember': user.arrayClubsMember });	//populates array that user is admin of
		}).catch((err) => console.log(err));
};


// Display all the clubs in our Mongo Collection
exports.getAllClubs = (req, res) => {
	Organization.find().select("_id name purpose description president").then((organizations) => {
		if (!organizations) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			return res.status(201).json({ 'organizations': organizations });
		}
	});
};

exports.isMember = (req, res) => {
	const { orgID } = req.body;
	const userID = req.user._id;

	Organization.findByIdAndUpdate(orgID).populate('imageId').then((organization) => {
		if (!organization)
			return res.status(400).json({ 'Error': 'No organization found' })
		const isMember = organization.members.indexOf(userID) != -1;
		var noteStatus;
		Notification.findOne({$and : [{idOfSender: req.user._id}, {idOfOrganization: orgID}, {$or: [{type: "ORG_JOIN_ADMIN"}, {type: "ORG_JOIN_MEMBER"}]}]}).then((notification) => {
			(notification && notification.isActive) ? noteStatus = true : noteStatus = false;
		})
		return res.status(201).json({ 'isMember': isMember && noteStatus, 'organization': organization });
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
	Organization.findByIdAndUpdate(orgID).populate({ path: 'members', populate: { path: 'avatar' } }).then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No organizations found' });
		} else {
			return res.status(201).json({ 'members': organization.members, 'adminCount': organization.admins.length, 'admins': organization.admins, idOfUser: req.user._id });
		}
	});
}

exports.addOrg = (req, res) => {
	// Code to add a new organization to the Mongo Collection

	// Destruct req body
	const { name, acronym, purpose, description } = req.body;
	User.findByIdAndUpdate(req.user._id).then((user) => {
		const president = user.name;

		// Check if organization with these key-value pairs already exists
		if (name && acronym && purpose && description) {
			Organization.findOne({ name: name }).then((organization) => {
				if (organization) {
					return res.status(400).json({ 'Error': 'Organization already exists' });
				} else {
					var new_img = new Img;
					new_img.img.data = fs.readFileSync(req.file.path)
					new_img.img.contentType = 'image/jpeg';
					new_img.save().then((image) => {
						// Make new organization and save into the Organizations Collection
						let newOrg = new Organization({
							name: name,
							president: president,
							acronym: acronym,
							admins: [],
							purpose: purpose,
							description: description,
							imageId: image._id
						});

						newOrg.save().then((organization) => {
							User.clubAdminPushing(organization._id, user._id);
							Organization.addAdminToClub(organization._id, req.user._id);
							if (organization) {
								Organization.findOne({ _id: organization._id }).populate('imageId').then((newOrganization) => {
									if (!newOrganization) {
										return res.status(400).json({ 'Error': 'No organizations found' });
									} else {
										return res.status(201).json({ 'organization': newOrganization });
									}
								});
							}
						}).catch((err) => { console.log(err); return res.status(400).json({ 'Error': err }) });
					}).catch((err) => {
						console.log(err);
					});
					// Push the new user onto the db if successful, else display error
				}
			}).catch(err => console.log(err));
		}
		else {
			return res.status(400).json({ 'Error': 'Error' });
		}
	});
};

exports.retrieveOrg = (req, res) => {
	//console.log({ req });
	const { orgID } = req.params;

	Organization.findOne({ _id: orgID }).populate('imageId').then((organization) => {
		if (organization)
			return res.status(201).json({ 'org': organization });
		else
			return res.status(400).json({ 'err': 'err' });
	});
};

exports.updateOrg = (req, res) => {
	const { orgID } = req.params;
	//console.log(orgID);

	const { name, acronym, purpose, description } = req.body;

	Organization.findById(orgID).then((organization) => {
		if (organization) {

			let updatedOrg = {
				name: name,
				president: organization.president,
				acronym: acronym,
				purpose: purpose,
				description: description
			};

			console.log('Check this out');
			console.log(updatedOrg);
			console.log(orgID);

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

exports.changePicture = (req, res) => {
	const { orgID } = req.body;
	console.log('entered', orgID);
  var new_img = new Img;
  new_img.img.data = fs.readFileSync(req.file.path)
  new_img.img.contentType = 'image/jpeg';
  new_img.save().then((image) => {
  Organization.findOne({_id: orgID}).then((organization) => {
      if (!organization) {
        return res.status(400).json({ 'err': 'err' });
      } else {
				var url = image._id;
				console.log('heeee ', image._id);
        Organization.findOneAndUpdate(
          { orgID },
          { $set: { "imageId": mongoose.Types.ObjectId(url) } },    // overwrites the previous profile with new one
          { new: true }
        ).then((org) => {
						Organization.findOne({_id: orgID}).populate('imageId').then((org) => {
							if(!org) {
								return res.status(400).json({'err': 'err'});
							} else {
								return res.status(201).json(org);
							}
						});
      });
  };
});
});
}
