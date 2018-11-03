const Conversations = require('./model')
const Organization = require('../Organizations/model')

exports.findMessages = (req, res) => {
	const {groupId} = req.params;
	console.log(groupId);
  Conversations.findOne({idOfClub: groupId}).populate('messages').then((conversation) => {
    if(!conversation) {
      return res.status(400).json({'Error':'No messages found'});
    } else {
			console.log('MARRRIO');
      return res.status(201).json({conversation:conversation});
    }
  });
};
