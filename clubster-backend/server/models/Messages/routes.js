const router = require('express').Router();
const controller = require('./controller');

router.post('/messages/:groupId', (req, res) => {
	controller.insertMessage(req, res);
});

module.exports = router;
