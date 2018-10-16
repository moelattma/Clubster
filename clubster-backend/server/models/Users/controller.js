/*
* This is the controller for the Users schema. In this file, we will code out the methods that will register or login a user.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const User = require('./model');              //import User Schema
const gravatar = require('gravatar');         //import gravatar, helps with profile
const Validator = require('validator');       //import the validator library, which does checking of email
const bcrypt = require('bcrypt');             //bcrypt library is useful for salting, hashing passwords
const jwt = require('jsonwebtoken');          //jwt is used for making a token for logged in users
const {secret} = require('../../../config');  //get secret fields for doing CRUD opertions on our database

var numberOfSaltIterations = 12;

exports.createUser = (req, res) => {
  //Code to register a User in our Mongo Collection
  const {username, name, email, password} = req.body; // Destructuring the req.body (i.e. extracting info)
  if (username && name && email && password){
  	User.findOne({email:email}).then((user)=> {
  		if (user){ // If the user already exists, reject duplicate account
  			return res.status(400).json({'Error':'User already exists'});
  		}
  		else{
  			// This makes the default profile picture (e.g. fb blank person)
  			const avatar = gravatar.url(req.body.email, { 
  				s: '200', 
  				r: 'PG',
  				d: 'mm',

  			});

  			// Creates a new User
  			let newUser = new User({
  				username: username,
  				name: name,
  				email: email,
  				password: password,
  				avatar
  			});

  			// Hashes the user's chosen password to make it more secure
  			bcrypt.hash(password, numberOfSaltIterations, function(err, hash){
 				if (err) throw err;
 				newUser.password = hash; 
 				newUser.save().then(user => res.json(user).catch(err => console.log(err))); // Push the new user onto the db if successful, else display error
  			});
  		}

  	});
  } 
  else {
  	return res.status(400).json({'Error':'Missing fields'});
  }
};

exports.findUser = (req,res) => {
  // Code to login a user to our mongo collection
}
