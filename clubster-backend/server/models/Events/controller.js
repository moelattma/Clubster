/*
* This is the controller for the Events schema.
* author: ayunus@ucsc.edu
*/

// Import
const Events = require('./model');	//events schema
const Organization = require('../Organizations/model');	//organizations schema
const mongoose = require('mongoose');	//mongoose, library to communicate with backend
const Comments = require('../Comments/model');

/*
*	Method to grab all events for an organization. This is used when tapping the events tab.
*/
exports.getEvents = (req, res) => {
	const { organizationID } = req.params;	// grabs id of organization in route URL.
	//Find the orgnaization with id = organizationID and populate it's array of events along with each event's image.
	Organization.findByIdAndUpdate(organizationID).populate({ path: 'events', populate: { path: 'host', select: 'name image' } }).then((organization) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No events found' });	//organization is null, DNE
		} else {
			return res.status(201).json({ 'events': organization.events, idOfUser: req.user._id }); //returns organization's events along with idOfUser
		}
	}).catch((err) => console.log(err));
};

exports.changeEventPicture = (req, res) => {
	const { eventID } = req.params;

	Events.findOneAndUpdate({ _id: eventID },{ $set: {"image": req.body.imageURL} }).then((event) => {
		if(!event) {
		  return res.status(404).json({ 'Error': 'error' });
		} else {
		  return res.status(201).json({ 'image': req.body.imageURL });
		}
	  });
};

/*
* Method to add a member to an event. This function is called when you tap the star on the event.
*/
exports.handleGoing = (req, res) => {
	const { eventID } = req.params;	// grabs the eventID from url
	const idOfAttender = req.user._id;	// grabs of id of user from passport instance.
	// Checks if Event exists. If it does, add idOfAttender to the event whose id = evetID's member array
	Events.findByIdAndUpdate(eventID).then((event) => {
		if (event) {
			var currentAttendees = event.going;	//grabs current array of members(id form)
			var isInArray = event.going.some(function (friend) {	//checks if the user is already in event's going array
				return friend.equals(idOfAttender);
			});
			//if user is in array, remove his/her id from the memeber array. Add him if otherwise.
			if (currentAttendees.length != 0 && isInArray) {
				Events.findOneAndUpdate(
					{ _id: eventID },
					{ $pull: { going: mongoose.Types.ObjectId(idOfAttender) } },
					{ new: true, upsert: true },
					function (error, event) {
						if (error) {
							console.log(error);
						} else {
							Organization.modifyActiveScore(event.organization,idOfAttender, event.value, -1);
							return res.status(201).json({ event });
						}
					});
			} else {
				Events.findOneAndUpdate(
					{ _id: eventID },
					{ $push: { going: mongoose.Types.ObjectId(idOfAttender) } },
					{ new: true, upsert: true },
					function (error, event) {
						if (error) {
							console.log(error);
						} else {
							Organization.modifyActiveScore(event.organization,idOfAttender, event.value, 1);
							return res.status(201).json({ event });
						}
					});
			}
		} else {
			return res.status(400).json({ 'err': 'err' });	//error
		}
	}).catch((err) => console.log(err));
}

/*
* Method to add event. We create an Event via the Event Schema and add it's id to the events array in the organization whose id = organizationID
*/
exports.addEvent = (req, res) => {
	const { organizationID } = req.params;	//grab the idOfOrganization whose id = idOfOrganization
	var { name, date, description, location, time, imageURL } = req.body;	//grab data from req.body
	//Next 4 lines are how to write image info to db. We are going to change this soon. Code is more to memorize
		//Find Organization whose id = organizationID
		Organization.findByIdAndUpdate(organizationID).then((organization) => {
			if (!organization) {
				return res.status(400).json({ 'Error': 'No such organization exists' }); //DNE, doesnt exist
			} else {
				//Create clubEvent document and expense document
				let clubEvent = new Events({
					organization: organizationID,
					name: name,
					date: date,
					description: description,
					host: req.user._id,
					location: location,
					time: time,
					going: [req.user._id],
					likers: [req.user._id],
					comments: [],
					image: imageURL,
					value: 5,
					totalComments: 0,
					totalLikes: 0
				});
				//write clubEvent to db
				clubEvent.save().then((event) => {
					// Add event's id to organization's events array
					Organization.addEventToClub(organizationID, event._id);
					Organization.increaseLikes(event.organization);
					// Find the Event whose id = event's id and populate it's image
					Events.findOne({ _id: event._id }).populate('host').then((event) => {
						return res.status(201).json({ 'event': event }); //return 201, all good
					}).catch(err => {
						return res.status(400).json({ 'Error': err });
					});
				}).catch((err) => {
					return res.status(400).json({ 'Error': err });
				});
			}
		});

}

exports.getLikers = (req, res) => {
	const { eventID } = req.params;	// grabs the eventID from url
	Events.findById(eventID).select('likers').populate({ path: 'likers', select: 'name image' }).then((event) => {
		if (!event) {
			return res.status(400).json({ 'Error': 'No events found' });
		} else {
			return res.status(201).json({ 'likers': event.likers });
		}
	});
}

exports.getGoing = (req, res) => {
	const { eventID } = req.params;	// grabs the eventID from url
	Events.findById(eventID).select('going').populate({ path: 'going', select: 'name image' }).then((event) => {
		if (!event) {
			return res.status(400).json({ 'Error': 'No events found' });
		} else {
			return res.status(201).json({ 'going': event.going });
		}
	});
}

exports.handleLike = (req, res) => {
	const { eventID } = req.params;	// grabs the eventID from url
	const idOfAttender = req.user._id;
	Events.findByIdAndUpdate(eventID).then((event) => {
		if (event) {
			var currentLikers = event.likers;	//grabs current array of members(id form)
			var isInArray = currentLikers.some(function (friend) {	//checks if the user is already in event's going array
				return friend.equals(idOfAttender);
			});
			//if user is in array, remove his/her id from the memeber array. Add him if otherwise.
			if (currentLikers.length != 0 && isInArray) {
				Events.findOneAndUpdate(
					{ _id: eventID },
					{ $pull: { likers: mongoose.Types.ObjectId(idOfAttender) } },
					{ new: true, upsert: true },
					function (error, event) {
						if (error) {
							console.log(error);
						} else {
							Organization.decreaseLikes(event.organization);
							return res.status(201).json({ event });
						}
					});
			} else {
				Events.findOneAndUpdate(
					{ _id: eventID },
					{ $push: { likers: mongoose.Types.ObjectId(idOfAttender) } },
					{ new: true, upsert: true },
					function (error, event) {
						if (error) {
							console.log(error);
						} else {
							Organization.increaseLikes(event.organization);
							return res.status(201).json({ event });
						}
					});
			}
		} else {
			return res.status(400).json({ 'err': 'err' });	//error
		}
	}).catch((err) => console.log(err));
}

exports.getComments = (req, res) => {
	const { eventID } = req.params;	// grabs id of organization in route URL.
	//Find the orgnaization with id = organizationID and populate it's array of events along with each event's image.
	Events.findByIdAndUpdate(eventID).populate({path: 'comments', populate: {path: 'userID'}}).then((event) => {
		if (!event) {
			console.log('wwwow');
			return res.status(400).json({ 'Error': 'No events found' });	//organization is null, DNE
		} else {
			console.log(event.comments);
			return res.status(201).json({ 'comments': event.comments, idOfUser: req.user._id }); //returns organization's events along with idOfUser
		}
	}).catch((err) => console.log(err));
}

exports.getPhotos = (req, res) => {
	const { eventID } = req.params;	// grabs id of organization in route URL.
	//Find the orgnaization with id = organizationID and populate it's array of events along with each event's image.
	Events.findByIdAndUpdate(eventID).then((event) => {
		if (!organization) {
			return res.status(400).json({ 'Error': 'No events found' });	//organization is null, DNE
		} else {
			return res.status(201).json({ 'photos': event.photos, idOfUser: req.user._id }); //returns organization's events along with idOfUser
		}
	}).catch((err) => console.log(err));
}

exports.addCommentToEvent = (req, res) => {
	const { eventID } = req.params;
	const { text } = req.body;
	let comment = new Comments({
  	userID: req.user._id,
		content: text
	});
	comment.save().then((comment) => {
			if(comment){
				Events.findOneAndUpdate(
					{ _id: eventID },
					{ $push: { comments: comment._id } },
					{ new: true, upsert: true },
					function (error, event) {
						if (error) {
							console.log(error);
						} else {
							Organization.increaseComments(event.organization);
							Comments.findByIdAndUpdate(comment._id).populate({path: 'userID'}).then((comment) => {
								return res.status(201).json({ comment });
							})
						}
					});
			}
			else {
				return res.status(400).json({ 'Error': 'No comments found' });
			}
	})
}
