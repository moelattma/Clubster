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
  arrayClubsMember: {
    type: Array,
    required: false
  },
  arrayClubsAdmin: [{
    type: Schema.Types.ObjectId,
    ref: 'organizations',
    required: false
  }]
});

User.statics.clubMemberPushing = async function(member, organization) {
  await this.findByIdAndUpdate(member, { $push: { arrayClubsMember: organization._id } });
}

User.statics.clubAdminPushing = async function(admin, organization) {
  await this.findByIdAndUpdate(admin, { $push: { arrayClubsAdmin: organization._id } });
}
/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('users', User);
