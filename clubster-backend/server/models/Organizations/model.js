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
const Organization = new Schema({
  President: {
    type: String,   //Specifiers
    required: true
  },
  VicePresident: {
    type: String,
    required: true
  },
  Treasurer: {
    type: String,
    required: true
  },
  Secretary: {
    type: String,
    required: true
  },
  EventsChair: {
    type: String,
    required: false
  }
  CommunicationChair: {
    type: String,
    required: false
  },
  WebMaster: {
    type: String,
    required: false
  },
  description: {
      type: String,
      required: true,
      minlength: 32,
      trim: true,
      unique:true
  },
  social: {
    facebook: {
      type: String
    },
    snapchat: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  members: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }],
});

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('Organization', Organization);
