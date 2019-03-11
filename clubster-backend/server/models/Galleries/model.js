/*
* Model for Rides.
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
* Creation of User Schema. We specify a const variable with fields: name, email, password, avatar, array of clubs where user is member, and array of clubs where user is admin.
*/
const Galleries = new Schema({
  photos: {
    type: [String]
  },
});

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('galleries', Galleries);
