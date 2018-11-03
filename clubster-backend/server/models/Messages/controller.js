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
    user: "5bcad6a3345dcf92dc99ec8f"
  });
  Conversations.findOne({idOfClub: groupId}).then((conversation) => {
    if(!conversation) {
      console.log("Here!!");
      return res.status(400).json({'Error':'No messages found'});
    } else {
      console.log(conversation);
      Conversations.addMessage(newMessage, conversation._id);
      newMessage.save().then((message) => { return res.status(201).json({message:newMessage})}).catch((err) => { return res.status(400).json({error:'err is sending message'})});
      
    }
  });
};
