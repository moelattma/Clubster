/*
* This is the controller for the Events schema.
* author: ayunus@ucsc.edu
*/

// Import
const Events = require('./model');
const Organization = require('../Organizations/model');
const Expenses = require('../Expenses/model');
exports.getEvents = (req, res) => {
	const { organizationID } = req.params;

	Organization.findByIdAndUpdate(organizationID).populate('events').then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No events found' });
		} else {
			return res.status(201).json({ 'events': organization.events });
		}
	}).catch((err) => console.log(err));
};

exports.addEvent = (req, res) => {
	const { organizationID } = req.params;
	const { name, date, description, expense } = req.body;

	Organization.findByIdAndUpdate(organizationID).then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No such organization exists' });
		} else {
			let clubEvent = new Events({
				organization: organizationID,
				name: name,
				date: date,
				description: description
			});
			let expenses = new Expenses({
				idOfClub:organizationID,
				amount: expense
			});
			expenses.save().then((expense) => {
					if(expense) {
						clubEvent.save().then((event) => {
							Organization.addEventToClub(organizationID, event._id);
							return res.status(201).json({ 'event': clubEvent });
						}).catch((err) => {
							return res.status(400).json({ 'Error': err });
						});
					}
				}).catch((err) => {
				return res.status(400).json({ 'Error': err });
			});

		}
	})
}
