/*
* This is the controller for the Users schema. In this file, we will code out the methods that will register or login a user.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const User = require('./model');              //import User Schema
// const gravatar = require('gravatar');         //import gravatar, helps with profile
const bcrypt = require('bcrypt');             //bcrypt library is useful for salting, hashing passwords
const jwt = require('jsonwebtoken');          //jwt is used for making a token for logged in users
const { secret } = require('../../../config');  //get secret fields for doing CRUD opertions on our database

var numberOfSaltIterations = 12;

exports.createUser = (req, res) => {
  //Code to register a User in our Mongo Collection
  const { username, name, email, password } = req.body; // Destructuring the req.body (i.e. extracting info)
  if (username && name && email && password) {
    User.findOne({ email: email }).then((user) => {
      if (user) { // If the user already exists, reject duplicate account
        return res.status(400).json({ 'Error': 'User already exists' });
      } else {

        // Creates a new User
        let newUser = new User({
          username: username,
          name: name,
          email: email,
          password: password
        });

        // Hashes the user's chosen password to make it more secure
        bcrypt.hash(password, numberOfSaltIterations, function (err, hash) {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => res.status(201).json({ 'user': user })).catch(err => console.log(err)); // Push the new user onto the db if successful, else display error
        });
      }
    });
  } else {
    return res.status(400).json({ 'Error': 'Missing fields' });
  }
};

exports.findUser = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.status(400).json({ 'Error': 'User does not exist' });
    } else {
      bcrypt.compare(password, user.password).then(same => {
        if (same) {
          const payload = { _id: user._id, name: user.name, avatar: user.avatar };
          let token = jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          });
        } else {
          return res.status(400).json({ 'Error': 'Password is incorrect' });
        }
      }).catch((err) => console.log(err));
    }
  });
}
