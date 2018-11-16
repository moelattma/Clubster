
/*
* This is the controller for the Notifications schema. In this file, we will code out the methods that will get all the notificatiosn based on the userID.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const Notification = require('./model');              //import Notification Schema
const Organizations = require('../Organizations/model')
const User = require('../Users/model')

const TYPES = ["ORG_JOIN",];

exports.grabNotifications = (req, res) => {
	//gets all notifications based on the userid
	Notification.find({ idOfReceivers: { $in: [req.user._id] } }).populate('idOfSender').populate('idOfOrganization').then((notifications) => {
		if (!notifications) {
			return res.status(400).json({ 'Error': 'No notifications found' });
		} else {
			return res.status(201).json({ 'notifications': notifications });
		}
	});
};

exports.addMember = (req, res) => {
	const { idOfMember, idOfOrganization } = req.params;

	// add idOfMember to Org's array
	Organizations.findOne({ id: idOfOrganization }).then((organization) => {
		if (!organizations) {
			return res.status(400).json({ 'Error': 'No organization found' });
		}

		else {
			Organizations.addMemberToClub(idOfOrganization, idOfMember);
			User.clubMemberPushing(idOfMember, idOfOrganization);
		}
	});
};

exports.addAdmin = (req, res) => {
	const { idOfAdmin, idOfOrganization } = req.params;

	// add idOfMember to Org's array
	Organizations.findOne({ id: idOfOrganization }).then((organization) => {
		if (!organizations) {
			return res.status(400).json({ 'Error': 'No organization found' });
		}

		else {
			Organizations.addAdminToClub(idOfOrganization, idOfAdmin);
			User.clubAdminPushing(idOfAdmin, idOfOrganization);
		}
	});
};

exports.newNotification = (req, res) => {
	const { type, organization } = req.body;
	const senderID = req.user._id;

	let notification = ({
		idOfSender: senderID,
		idOfOrganization: organization._id,
		idOfReceivers: [],
		type: type
	});

	switch (type) {
		case "ORG_JOIN":
			notification.idOfReceivers = organization.admins;
			new Notification(notification).save().then((newNote) => {
				return res.status(201).json(newNote);
			});
			break;

	}
}

// newJoinNotification = (senderID, organization) => {
// 	console.log('senderid is ', senderID);
// 	console.log('org admins are ', organization.admins);
// 	let notification = new Notification({
// 		idOfSender: senderID,
// 		idOfReceivers: organization.admins
// 	});
// }

// exports.addNotification = (req, res) => {
// 	console.log(req.user);
// 	let notification = new Notifications({
// 		idOfSender: req.user._id,
// 		idOfReciever: req.user._id,
// 		type: "You are now a member of ACM!"
// 	});

// 	notification.save().then((notification) => {
// 		return res.status(201).json({'notification': notification});
// 	}).catch((err) => {
// 		return res.status(401).json({'error': err});
// 	});
// };