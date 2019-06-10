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
const Channel = new Schema({
  name: {
    type: String,
    required: true
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organizations'
  },
  members: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }],
  admins: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'users'
  }],
  image: {
    type: String
  },
  messages: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'messages'
  }]
});

Channel.statics.addMessage = async function(message, idOfChannel) {
  await this.findByIdAndUpdate(idOfChannel, { $push: { messages: message._id } });
}
/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('channels', Channel);
