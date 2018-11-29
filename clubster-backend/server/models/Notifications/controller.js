
/*
* This is the controller for the Notifications schema. In this file, we will code out the methods that will get all the notificatiosn based on the userID.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const Notification = require('./model');              //import Notification Schema
const Organization = require('../Organizations/model')
const User = require('../Users/model')

const CLUBSTER_WELCOME = "CLUBSTER_WELCOME";
const ORG_JOIN_ADMIN = "ORG_JOIN_ADMIN";
const ORG_JOIN_MEM = "ORG_JOIN_MEMBER";
const ACCEPT_ADMIN = "ACCEPT_ADMIN";
const ACCEPT_MEM = "ACCEPT_MEMBER";
const REJECT_JOIN = "REJECT_JOIN";

exports.grabNotifications = (req, res) => {
	//gets all notifications based on the userid
	Notification.find({ idOfReceivers: { $in: [req.user._id] } }).populate('idOfOrganization').then((notifications) => {
		if (!notifications) {
			return res.status(400).json({ 'Error': 'No notifications found' });
		} else {
			return res.status(201).json({ 'notifications': notifications });
		}
	});
};

exports.joinOrganization = (req, res) => {
	const { _id, joinerID, orgID, joinType, accepted } = req.body;

	if (accepted) { // add idOfMember to Org's array
		Organization.findByIdAndUpdate(orgID).then((organization) => {
			if (!organization) {
				return res.status(400).json({ 'Error': 'No such organization found' });
			} else {
				if (joinType == ORG_JOIN_MEM) {
					Organization.addMemberToClub(orgID, joinerID);
					User.clubMemberPushing(orgID, joinerID);
				} else if (joinType == ORG_JOIN_ADMIN) {
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
	const { type, organization, receiverID } = req.body;
	const senderID = req.user._id;

	let notification = ({
		idOfSender: senderID,
		idOfOrganization: null,
		idOfReceivers: [],
		type: type,
		isActive: false,
		message: ""
	});

	switch (type) {
		case CLUBSTER_WELCOME:
			notification.idOfReceivers = [senderID];
			notification.message = `Welcome to Clubster!`
			break;

		case ORG_JOIN_ADMIN:
		case ORG_JOIN_MEM:
			notification.idOfOrganization = organization._id;
			notification.idOfReceivers = organization.admins;
			notification.message = `${req.user.name} wants to join ${organization.name} as ` + ((type == ORG_JOIN_ADMIN) ? `an admin` : `a member`);
			notification.isActive = true;
			break;

		case ACCEPT_ADMIN:
		case ACCEPT_MEM:
			notification.idOfOrganization = organization._id;
			notification.idOfReceivers = [receiverID];
			notification.message = `You have been accepted to ${organization.name} as ` + ((type == ACCEPT_ADMIN) ? `an admin` : `a member`);
			break;

		case REJECT_JOIN:
			notification.idOfOrganization = organization._id;
			notification.idOfReceivers = [receiverID];
			notification.message = `You have been rejected from ${organization.name} :(`;
			break;
	}

	Notification.findOne({ $and: [{ type: type }, {idOfOrganization: organization._id}, {idOfSender: senderID}]}).then((notification)=>{
		if(notification){
			return res.status(400).json({ 'Error': 'Duplicate notification sent' });
		}
		else{
			new Notification(notification).save().then((newNote) => { return res.status(201).json(newNote); });
		}
	});
}