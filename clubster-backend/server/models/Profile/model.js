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
const Profile = new Schema({
  user: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  },
  major: {
    type: String
  },
  description: {
    type: String,
  },
  image: {
    type: String
  },
  hobbies: {
    type: [String],
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  }
});

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('Profile', Profile);
