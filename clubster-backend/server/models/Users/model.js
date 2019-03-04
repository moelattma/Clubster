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
    required: true
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
    required: true
  },
  image: {
    type: String
  },
  arrayClubsMember: [{
    type: Schema.Types.ObjectId,
    ref: 'organizations',
    required: false
  }],
  activityScore:{
    type:Number
  },
  arrayClubsAdmin: [{
    type: Schema.Types.ObjectId,
    ref: 'organizations',
    required: false
  }],
  major: {
    type: String
  },
  biography: {
    type: String
  },
  hobbies: {
    type: [String]
  },
  photos:  {
    type: [String]
  },
});

User.statics.clubMemberPushing = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(memberID, { $push: { arrayClubsMember: organizationID } });
}

User.statics.clubAdminPushing = async function(organizationID, adminID) {
  await this.findByIdAndUpdate(adminID, { $push: { arrayClubsAdmin: organizationID } });
}

User.statics.removeClubMember = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(memberID, { $pull: { arrayClubsMember: organizationID } });
}
/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('users', User);
