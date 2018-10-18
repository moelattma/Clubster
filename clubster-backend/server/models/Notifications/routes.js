const router = require('express').Router();
const controller = require('./controller');

router.get('/:userID/notifications', (req, res) => {
	controller.grabNotifications(req, res);
});
