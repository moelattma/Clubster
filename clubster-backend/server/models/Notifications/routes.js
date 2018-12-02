const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.get('/notifications', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.grabNotifications(req, res);
});

router.post('/notifications/joinOrganization', (req, res) => {
	controller.joinOrganization(req, res);
});

router.post('/notifications/new', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.newNotification(req, res);
});

router.post('/notifications/newNoAuthenticate', (req, res) => {
	controller.newNotification(req, res);
});

module.exports = router;