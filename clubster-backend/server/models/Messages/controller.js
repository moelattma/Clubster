const Conversations = require('../Conversations/model');
const Organization = require('../Organizations/model');
const Message = require('./model');
const Channels = require('../Channels/model');

exports.insertMessage = (req, res) => {
  const { text } = req.body;
	const { channelID } = req.params;
  console.log(text, channelID);
  let newMessage = new Message({
    text: text,
    createdAt: Date.now(),
    user: req.user._id
  });
  Channels.findOne({_id:channelID}).populate({
         path    : 'messages',
         populate: [
             { path: 'user' }
         ]
    }).then((channel) => {
    if(!channel) {
      console.log('errr');
      return res.status(400).json({'error':'err is sending message'});
    } else {
      newMessage.save().then((messageObj) => {

        Channels.addMessage(messageObj, channel._id);
        Message.findOne({_id: messageObj._id}).populate('user').then((message) => {
          return res.status(201).json({message:message})}).catch((err) => { return res.status(400).json({'error':'err is sending message'})});
      }).catch(err => { return console.log(err)});
    }
  });
};
