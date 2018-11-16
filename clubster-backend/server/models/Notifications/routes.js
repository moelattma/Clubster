const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.get('/notifications', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.grabNotifications(req, res);
});

router.post('/notifications/:idOfOrganization/:idOfMember', (req, res) => {
	controller.addMember(req, res);
});

router.post('/notifications/:idOfOrganization/:idOfAdmin', (req, res) => {
	controller.addAdmin(req, res);
});

router.post('/notifications/new', passport.authenticate('jwt', { session: false }), (req, res) => {
	controller.newNotification(req, res);
});

module.exports = router;