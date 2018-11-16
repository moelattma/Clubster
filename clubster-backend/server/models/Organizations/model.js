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
  president: {
    type: String,   //Specifiers
    required: true
  },
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  name: {
    type: String,
    required: true
  },
  acronym: {
    type: String,
    required: true
  },
  description: {
      type: String,
      required: true,
      minlength: 32,
      trim: true,
      unique: true
  },
  purpose: {
    type: String,
    required: true,
    minlength: 32,
    trim: true,
    unique: true
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
  events: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'Events'
  }]
});

Organization.statics.addMemberToClub = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(organizationID, { $push: { members: memberID } });
}

Organization.statics.addAdminToClub = async function(organizationID, adminID) {
  await this.findByIdAndUpdate(organizationID, { $push: { admins: adminID } });
}
Organization.statics.deleteClubMember = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(organizationID, { $pull: { members: memberID } });
}

Organization.statics.addEventToClub = async function(organizationID, eventID) {
  await this.findByIdAndUpdate(organizationID, { $push: { events: eventID } });
}

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('organizations', Organization);
