const Channels = require('./model');
const Organization = require('../Organizations/model')
const mongoose = require('mongoose');	//mongoose, library to communicate with backend

exports.findChannels = (req, res) => {
	const { groupID } = req.params;
  let channelsMember = [];
	let channelsAdmin = [];
  Channels.find({organization: groupID}).populate('messages').then((channels) => {
    if(channels) {

      for(var i = 0;i<channels.length;i++) {
				if(channels[i].admins.indexOf(req.user._id) > -1) {
					channelsAdmin.push(channels[i]);
        } else if((channels[i].members.indexOf(req.user._id) > -1) && !channels[i].admins.includes(req.user._id)) {
          channelsMember.push(channels[i]);
        }
      }
      return res.status(201).json({ channelsMember, channelsAdmin });
    } else {
      return res.status(404).json({'Error': 'Not in any channels for this group'});
    }
  })
};

exports.createChannel = (req,res) => {
	const { members, admins, name } = req.body;

}

exports.addMembersToChannel = (req, res) => {
	const { channelID } = req.params;
  const { members } = req.body; // arr.join() to get list, not array, of ids
  var memberArr = []
  for(var i = 0;i<members.split(",").length;i++) {
    memberArr.push(mongoose.Types.ObjectId(members[i]));
  }
  Channels.findOneAndUpdate(
		{ _id: channelID },
		{ $set: { members: memberArr } },
		{ new: true, upsert: true },
		function (error, channel) {
			if (error) {
				console.log(error);
			} else {
				return res.status(201).json({ channel });
			}
		});
};

exports.deleteMemberOfChannel = (req, res) => {
	const { channelID,memberID } = req.params;
  Channels.findOneAndUpdate(
		{ _id: channelID },
		{ $pull: { members: memberID } },
		{ new: true, upsert: true },
		function (error, channel) {
			if (error) {
				console.log(error);
			} else {
				return res.status(201).json({ channel });
			}
		});
};

exports.makeChannel = (req,res) => {
	const { groupID } = req.params;
	const { name, members, admins } = req.body;
	console.log(members, admins);
	var arrAdmins = admins.split(',');
	arrAdmins.push(req.user._id);
	let channel = new Channels({
		name: name,
		organization: groupID,
		members: members.split(','),
		admins: arrAdmins,
		messages: []
	});
	channel.save().then((channel) => {
		if(channel) {
			return res.status(201).json({ channel });
		} else {
			return res.status(404).json({ 'error':'error' });
		}
	})
}
