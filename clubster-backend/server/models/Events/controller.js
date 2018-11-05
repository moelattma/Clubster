/*
* This is the controller for the Events schema.
* author: ayunus@ucsc.edu
*/

// Import
const Events = require('./model');
const Organization = require('../Organizations/model');

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
	const { name, date, description } = req.body;

	Organization.findByIdAndUpdate(organizationID).then((organization) => {
		console.log(organization);
		if (!organization) {
			return res.status(400).json({ 'Error': 'No such organization exists' });
		} else {
			let clubEvent = new Events({
				organization: organizationID,
				name: name,
				date: date,
				description: description
			});
			clubEvent.save().then((event) => {
				Organization.addEventToClub(organizationID, event._id);
				return res.status(201).json({ 'event': clubEvent });
			}).catch((err) => {
				return res.status(400).json({ 'Error': err });
			});
		}
	})
}