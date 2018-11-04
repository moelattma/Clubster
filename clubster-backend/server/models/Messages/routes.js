const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.post('/messages/:groupId', passport.authenticate('jwt', {session:false}), (req, res) => {
	console.log('rrr');
	controller.insertMessage(req, res);
});

module.exports = router;
