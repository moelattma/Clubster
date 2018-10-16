/*
* This is the controller for the Users schema. In this file, we will code out the methods that will register or login a user.
* author: ayunus@ucsc.edu
*
*/

//Import Node.js libraries.
const User = require('./model');              //import User Schema
const gravatar = require('gravatar');         //import gravatar, helps with profile
const Validator = require('validator');       //import the validator library, which does checking of email
const bcrypt = require('bcrypt');             //bcrypt library is useful for salting, hashing passwords
const jwt = require('jsonwebtoken');          //jwt is used for making a token for logged in users
const {secret} = require('../../../config');  //get secret fields for doing CRUD opertions on our database

exports.createUser = (req, res) => {
  //Code to register a User in our Mongo Collection
};

exports.findUser = (req,res) => {
  // Code to login a user to our mongo collection
}
