/*
* This is the controller for the Events schema.
* author: ayunus@ucsc.edu
*/

// Import
const Events = require('./model');
const Organization = require('../Organizations/model');

exports.getEvents = (req, res) => {
	const { organizationID } = req.params;

	Organization.findOne({ _id: organizationID }).populate('events').then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No events found' });
		} else {
			return res.status(201).json({ 'events': organization.events });
		}	
	});
};

exports.addEvent = (req, res) => {
	const { organizationID } = req.params;
	const { name, date, time, description } = req.body;

	Organization.findOne({ _id: organizationID }).then((organization) => {
		if (!organization) {
			console.log("gay");
			return res.status(400).json({ 'Error': 'No events found' });
		} else {
			let newEvent = new Events({
				organization: organizationID,
				name: name,
				date: date,
				time: time,
				description: description
			});
			newEvent.save().then((event) => {
				Organization.addEventToClub(organizationID, newEvent._id);
				return res.status(201).json({ 'event': event });
			}).catch((err) => {
				return res.status(400).json({ 'Error': err });
			});
			
		}
	})
}