const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.get('/conversations/:groupId', passport.authenticate('jwt', {session:false}), (req, res) => {
	controller.findMessages(req, res);
});

router.post('/conversations/:groupId', (req, res) => {
	controller.insertMessage(req, res);
});

module.exports = router;
