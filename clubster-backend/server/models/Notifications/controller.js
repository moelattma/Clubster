
/*
* This is the controller for the Notifications schema. In this file, we will code out the methods that will get all the notificatiosn based on the userID.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const Notifications = require('./model');              //import Notification Schema
const Organizations = require('../Organizations/model')
const User = require('../Users/model')

exports.grabNotifications = (req, res) => {
  //gets all notifications based on the userid
  console.log(req.body._id);
  const {id} = req.headers;
  Notifications.find({id: req.body._id}).then((notifications) => {
		if (!notifications)
		{
			return res.status(400).json({'Error':'No notifications found'});
		}

		else{
			return res.status(201).json({'notifications': notifications});
		}
	});
};

exports.addMember = (req, res) => {
	const {idOfMember, idOfOrganization} = req.params;

	// add idOfMember to Org's array
	Organizations.findOne({id: idOfOrganization}).then((organization) => {
		if (!organizations)
		{
			return res.status(400).json({'Error':'No organization found'});
		}

		else {
			Organizations.addMemberToClub(idOfOrganization, idOfMember);
			User.clubMemberPushing(idOfMember, idOfOrganization);
		}
	});
};

exports.addAdmin = (req, res) => {
	const {idOfAdmin, idOfOrganization} = req.params;

	// add idOfMember to Org's array
	Organizations.findOne({id: idOfOrganization}).then((organization) => {
		if (!organizations)
		{
			return res.status(400).json({'Error':'No organization found'});
		}

		else {
			Organizations.addAdminToClub(idOfOrganization, idOfAdmin);
			User.clubAdminPushing(idOfAdmin, idOfOrganization);
		}
	});
};

exports.addNotification = (req, res) => {
	console.log(req.user);
	let notification = new Notifications({
		idOfSender: req.user._id,
		idOfReciever: req.user._id,
		type: "You are now a member of ACM!"
	});

	notification.save().then((notification) => {
		return res.status(201).json({'notification': notification});
	}).catch((err) => {
		return res.status(401).json({'error': err});
	});
};
