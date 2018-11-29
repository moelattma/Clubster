/*
* This is the controller for the Events schema.
* author: ayunus@ucsc.edu
*/

// Import
const Events = require('./model');
const Organization = require('../Organizations/model');
const Expenses = require('../Expenses/model');
const mongoose = require('mongoose');
const Img = require('../Images/model');
const fs = require('fs');

exports.getEvents = (req, res) => {
	const { organizationID } = req.params;

	Organization.findByIdAndUpdate(organizationID).populate({ path: 'events', populate: { path: 'image' } }).then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No events found' });
		} else {
			return res.status(201).json({ 'events': organization.events, idOfUser: req.user._id });
		}
	}).catch((err) => console.log(err));
};

exports.addMemberToEvent = (req,res) => {
	const { eventID } = req.params;
	const idOfAttender = req.user._id;
	Events.findByIdAndUpdate(eventID).then((event) => {
		if(event) {
			var currentAttendees = event.going;
			console.log('current: ', event.going);
			var isInArray = event.going.some(function (friend) {
    		return friend.equals(idOfAttender);
			});
			if(currentAttendees.length != 0 && isInArray) {
				Events.findOneAndUpdate(
   				{ _id: eventID },
   				{ $pull: { going: mongoose.Types.ObjectId(idOfAttender) }},
					{new: true, upsert: true},
  					function (error, event) {
        			if (error) {
            		console.log(error);
        			} else {
            		return res.status(201).json({event});
        	}
    		});
			} else {
				console.log('here');
				Events.findOneAndUpdate(
					{ _id: eventID },
					{ $push: { going: mongoose.Types.ObjectId(idOfAttender) }},
					{new: true, upsert: true},
						function (error, event) {
							if (error) {
								console.log(error);
							} else {
								return res.status(201).json({event});
					}
				});
			}
		} else {
			return res.status(400).json({'err': 'err'});
		}
	}).catch((err) => console.log(err));
}

exports.addEvent = (req, res) => {
	const { organizationID } = req.params;
	const { name, date, description, expense } = req.body;
	var new_img = new Img;
	new_img.img.data = fs.readFileSync(req.file.path)
	new_img.img.contentType = 'image/jpeg';
	new_img.save().then((image) => {
		Organization.findByIdAndUpdate(organizationID).then((organization) => {
			if (!organization) {
				return res.status(400).json({ 'Error': 'No such organization exists' });
			} else {
				let clubEvent = new Events({
					organization: organizationID,
					name: name,
					date: date,
					description: description,
					going: [req.user._id],
					image: image._id
				});
				let expenses = new Expenses({
					idOfClub:organizationID,
					amount: expense
				});
				expenses.save().then((expense) => {
						if(expense) {
							clubEvent.save().then((event) => {
								Organization.addEventToClub(organizationID, event._id);
								Events.findOne({_id: event._id}).populate('image').then((event) => {
									return res.status(201).json({ 'event': event });
								}).catch(err => {
									return res.status(400).json({ 'Error': err });
								});
							}).catch((err) => {
								return res.status(400).json({ 'Error': err });
							});
						}
					}).catch((err) => {
					return res.status(400).json({ 'Error': err });
				});

			}
		});
	});
}
