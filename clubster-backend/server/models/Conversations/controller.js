const Conversations = require('./model');
const Organization = require('../Organizations/model')
const PORT = process.env.PORT || 3000;

exports.findMessages = (req, res) => {
	const {groupId} = req.params;
	console.log(groupId);
  Conversations.findOne({idOfClub: groupId}).populate({
         path    : 'messages',
         populate: [
             { path: 'user' }
         ]
    }).then((conversation) => {
    if(!conversation) {
			let conversation = new Conversations({
        idOfClub: groupId,
        messages: []
      });
      conversation.save().then((conversation) => {
				return res.status(201).json({conversation:conversation, userId: req.user._id});
			});
    } else {
			console.log('MARRRIO');
      return res.status(201).json({conversation:conversation, userId: req.user._id});
    }
  });
};
