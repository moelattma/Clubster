/*
* Model for Profile.
* Author: ayunus@ucsc.edu
* Class: CS115
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* Creation of User Schema. We specify a const variable with fields: name, email, password, avatar, array of clubs where user is member, and array of clubs where user is admin.
*/
const Events = new Schema({
  organization: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'organizations'
  },
  name: {
    type: String
  },
  date: {
    type: String
  },
  location: {
    type: String
  },
  time: {
    type:String
  },
  description: {
    type: String,
    trim: true,
    unique: true
  },
  host: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  },
  image: {
    type: String
  },
  photos: [{
    type:String
  }],
  value: {
    type: Number
  },
  going: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }],
  likers: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }],
  rides: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'Rides'
  }],
  comments: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'comments'
  }]
});

//Method to add a user going to an event. Async/Await method
Events.statics.addGoingUser = async function(eventID, userID) {
  await this.findByIdAndUpdate(eventID, { $push: { going: userID } });
}
//Method to remove a user from an event. Async/Await method
Events.statics.removeGoingUser = async function(eventID, userID) {
  await this.findByIdAndUpdate(eventID, { $pull: { going: userID } });
}

Events.statics.removeGoingUser = async function(eventID, userID) {
  await this.findByIdAndUpdate(eventID, { $pull: { going: userID } });
}

Events.statics.updateInfoByIndex = async function(eventID) {
  console.log('hi');
  await this.update({_id:eventID}, { $inc: {value:1 }});
}
  Events.statics.addEventRide = async function(eventID, rideID) {
  await this.findByIdAndUpdate(eventID, { $push: { rides: rideID } });
}

Events.statics.removeEventRide = async function(eventID, rideID) {
  await this.findByIdAndUpdate(eventID, { $pull: { rides: rideID } });
}

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('events', Events);
