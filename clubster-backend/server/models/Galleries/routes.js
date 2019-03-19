//Rides POST / GET

const router = require('express').Router();
const controller = require('./controller');

router.post('/galleries/:galleryID/addPhoto', (req, res) => {
	controller.addPhoto(req, res);
});

router.post('/galleries/:galleryID/replacePhoto', (req, res) => {
	controller.replacePhoto(req, res);
});

module.exports = router;
