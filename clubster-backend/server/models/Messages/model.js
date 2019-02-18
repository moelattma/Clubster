const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type:Date,
    default: Date.now
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false
  }

});


module.exports = mongoose.model('messages', Messages);
