const router = require('express').Router();
const controller = require('./controller');
const passport = require('passport');

router.get('/notifications', (req, res) => {
	controller.grabNotifications(req, res);
});

router.post('/notifications/:idOfOrganization/:idOfMember', (req, res) => {
	controller.addMember(req, res);
});

router.post('/notifications/:idOfOrganization/:idOfAdmin', (req, res) => {
	controller.addAdmin(req, res);
});

router.post('/notifications',passport.authenticate('jwt', { session: false }),(req, res) => {
	controller.addNotification(req, res); // dummy route (not going to be used)
});

module.exports = router;