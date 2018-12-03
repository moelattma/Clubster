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
  description: {
    type: String,
    trim: true,
    unique: true
  },
  image: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'images'
  },
  going: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }]
});

Events.statics.addGoingUser = async function(eventID, userID) {
  await this.findByIdAndUpdate(eventID, { $push: { going: userID } });
}

Events.statics.removeGoingUser = async function(eventID, userID) {
  await this.findByIdAndUpdate(eventID, { $pull: { going: userID } });
}

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('events', Events);
