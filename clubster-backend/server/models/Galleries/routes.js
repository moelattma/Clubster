//Rides POST / GET

const router = require('express').Router();
const controller = require('./controller');

router.post('/galleries/:galleryID/newPhoto', (req, res) => {
	controller.newPhoto(req, res);
});

module.exports = router;
