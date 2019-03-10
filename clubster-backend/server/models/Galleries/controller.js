const Galleries = require('./model');

exports.newPhoto = (req, res) => {
	Galleries.findOneAndUpdate({ _id: req.params.orgID }, { $push: { "image": req.body.imageURL } }).then((organization) => {
		if (!organization) {
			return res.status(404).json({ 'Error': 'error', 'image': null });
		} else {
			return res.status(201).json({ 'image': req.body.imageURL });
		}
	});
};
