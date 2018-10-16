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
    minlength: 5
  },
  name: {
    type: String,
    required: true,
    minlength: 4
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  arrayClubsMember: {
    type: Array,
    required: false
  },
  arrayClubsAdmin: {
    type: Array,
    required: false
  }
});

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('User', User);
