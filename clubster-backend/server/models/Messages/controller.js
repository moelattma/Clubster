const Conversations = require('../Conversations/model');
const Organization = require('../Organizations/model');
const Message = require('./model');
exports.insertMessage = (req, res) => {
  const { text } = req.body;
	const {groupId} = req.params;
  console.log(groupId);
  let newMessage = new Message({
    text: text,
    createdAt: Date.now(),
    user: req.user._id
  });
  Conversations.findOne({idOfClub: groupId}).populate({
         path    : 'messages',
         populate: [
             { path: 'user' }
         ]
    }).then((conversation) => {
    if(!conversation) {
      console.log("Here!!");
      return res.status(400).json({'Error':'No messages found'});
    } else {
      console.log(conversation);
      Conversations.addMessage(newMessage, conversation._id);
      newMessage.save().then((messageObj) => {
        Message.findOne({_id: messageObj._id}).populate('user').then((message) => {
          return res.status(201).json({message:message})}).catch((err) => { return res.status(400).json({error:'err is sending message'})});
        }).catch(err => { return console.log(err)});
    }
  });
};
