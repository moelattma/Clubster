/*
* Model for Notifications, Users will be notified of rides they are getting, club events, giving feedback and whether they got accepted as a member to an organization.
* Author: ayunus@ucsc.edu
* Class: CS115
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* Creation of Notifications Schema.the schema is in a notifications const var. and it has the necessary fields.
*/
const Notifications = new Schema({
  idOfSender: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  },
  idOfOrganization: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'organizations',
    required: false
  },
  idOfReceivers: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }],
  eventID: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'events'
  },
  type: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  message: {
    type: String
  }
});

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('Notification', Notifications);
