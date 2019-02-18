const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conversations = new Schema({
	idOfClub: {
		type: Schema.Types.ObjectId,
		ref: 'organizations',
		required: true
	},
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'messages',
    required: false
  }]
});

Conversations.statics.addMessage = async function(message, idOfConversation) {
  await this.findByIdAndUpdate(idOfConversation, { $push: { messages: message._id } });
}

module.exports = mongoose.model('Conversations', Conversations);
