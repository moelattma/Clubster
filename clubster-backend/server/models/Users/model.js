/*
* Model for Users. When User hits register, we will make a User object and push the data as a document onto MongoDB.
* Author: ayunus@ucsc.edu
* Class: CS115
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* Creation of User Schema. We specify a const variable with fields: name, email, password, avatar, array of clubs where user is member, and array of clubs where user is admin.
*/
const User = new Schema({
  username: {
    type: String,   //Specifiers
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  avatar: {
    type: String
  },
  arrayClubsMember: [{
    type: Schema.Types.ObjectId,
    ref: 'organizations',
    required: false
  }],
  arrayClubsAdmin: [{
    type: Schema.Types.ObjectId,
    ref: 'organizations',
    required: false
  }]
});

User.statics.clubMemberPushing = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(memberID, { $push: { arrayClubsMember: organizationID } });
}

User.statics.clubAdminPushing = async function(organizationID, adminID) {
  await this.findByIdAndUpdate(adminID, { $push: { arrayClubsAdmin: organizationID } });
  await this.findByIdAndUpdate(adminID, { $push: { arrayClubsMember: organizationID } });
}

User.statics.leaveClub = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(organizationID, { $pull: { arrayClubsAdmin: memberID } });
  await this.findByIdAndUpdate(organizationID, { $pull: { arrayClubsMember: memberID } });
}
/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('users', User);
