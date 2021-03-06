const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');


router.post('/messages/:channelID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.insertMessage(req, res);
});

module.exports = router;
