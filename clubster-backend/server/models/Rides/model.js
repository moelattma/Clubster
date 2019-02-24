/*
* Model for Rides.
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* Creation of User Schema. We specify a const variable with fields: name, email, password, avatar, array of clubs where user is member, and array of clubs where user is admin.
*/
const Rides = new Schema({
  driverid: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  },
  ridersid: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  passangerSeats: {
    type: Number
  },
  description: {
    type: String
  }
});

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('Rides', Rides);
