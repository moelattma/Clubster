/*
* This is the controller for the Notifications schema. In this file, we will code out the methods that will get all the notificatiosn based on the userID.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const Notification = require('./model');	//import Notification Schema
const Organization = require('../Organizations/model')	//import Notification Schema
const User = require('../Users/model');	//import User Model

//Tags later utilized in code
const CLUBSTER_WELCOME = "CLUBSTER_WELCOME";
const ORG_JOIN_ADMIN = "ORG_JOIN_ADMIN";
const ORG_JOIN_MEM = "ORG_JOIN_MEMBER";
const ACCEPT_ADMIN = "ACCEPT_ADMIN";
const ACCEPT_MEM = "ACCEPT_MEMBER";
const REJECT_JOIN = "REJECT_JOIN";

/*
* gets all notifications based on the userid
*/
exports.grabNotifications = (req, res) => {
	Notification.find({ idOfReceivers: { $in: [req.user._id] } })
	.populate('idOfOrganization')
	.populate('idOfSender')
	.then((notifications) => {
		if (!notifications) {
			return res.status(400).json({ 'Error': 'No notifications found' });
		} else {
			return res.status(201).json({ 'notifications': notifications.reverse() });
		}
	});
};

/*
* Notification to add joinerID to organization's members or adim arrat
*/
exports.joinOrganization = (req, res) => {
	const { _id, joinerID, orgID, joinType, accepted } = req.body;

	if (accepted) { // add idOfMember to Org's array
		Organization.findByIdAndUpdate(orgID).then((organization) => {
			if (!organization) {
				return res.status(400).json({ 'Error': 'No such organization found' });
			} else {
				if (joinType == ORG_JOIN_MEM) {	//add as member
					Organization.addMemberToClub(orgID, joinerID);
					User.clubMemberPushing(orgID, joinerID);
				} else if (joinType == ORG_JOIN_ADMIN) {	//add as admin
					Organization.addAdminToClub(orgID, joinerID);
					User.clubAdminPushing(orgID, joinerID);
				}
			}
		});
	}

	Notification.findByIdAndUpdate(_id).then((notification) => {
		if (!notification) {
			return res.status(400).json({ 'Error': 'No such notification found' })
		} else {
			notification.isActive = false;
			notification.save();
		}
	});
};

exports.newNotification = (req, res) => {
	const { type, orgID, receiverID } = req.body;
	const senderID = (req.user ? req.user._id : req.body.senderID);

	let notification = ({
		idOfSender: senderID,
		idOfOrganization: orgID,
		idOfReceivers: [receiverID],
		type: type,
		isActive: false,
		message: ""
	});

	if (orgID) {
		Organization.findById(orgID).then((organization) => {
			const { name, admins } = organization;

			switch (type) {
				case ORG_JOIN_ADMIN:
				case ORG_JOIN_MEM:
					notification.idOfReceivers = [];
					for (var i = 0; i < admins.length; ++i) 
						notification.idOfReceivers.push(admins[i].admin);
					notification.message = `${req.user.name} wants to join ${name} as ` + ((type == ORG_JOIN_ADMIN) ? `an admin!` : `a member!`);
					notification.isActive = true;
					break;

				case ACCEPT_ADMIN:
				case ACCEPT_MEM:
					notification.message = `You have been accepted to ${name} as ` + ((type == ACCEPT_ADMIN) ? `an admin!` : `a member!`);
					break;

				case REJECT_JOIN:
					notification.message = `You have been rejected from ${name} :(`;
					break;
			}
			new Notification(notification).save().then((newNote) => { return res.status(201).json(newNote); });
		});
	} else {
		switch (type) {
			case CLUBSTER_WELCOME:
				notification.idOfReceivers = [senderID];
				notification.message = `Welcome to Clubster! This is your notifications page.`
				break;
		}
		new Notification(notification).save().then((newNote) => { return res.status(201).json(newNote); });
	}
}
