const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.get('/channels/:groupID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.findChannels(req, res);
});

router.post('/channels/:groupID', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.makeChannel(req, res);
});

module.exports = router;
