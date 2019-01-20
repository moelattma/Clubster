/*
* This is the routes file for the Images schema. Based on the url axios has inside, the appropriate function will execute
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/
const fs = require('fs');
const multer = require('multer');
const router = require('express').Router();
var upload = multer({ dest: 'uploads/' });
const Img = require('./model');
router.post('/img_data', upload.single('fileData'), function(req, res) {

    var new_img = new Img;
    new_img.img.data = fs.readFileSync(req.file.path)
    new_img.img.contentType = 'image/jpeg';
    new_img.save();
    return res.status(201).json({ message: 'New image added to the db!' });
});



router.get('/img_data', function(req, res) {
    Img.findOne({}, 'img createdAt', function(err, img) {
        if (err)
            res.send(err);
        res.contentType('json');
        res.send(img);
    }).sort({ createdAt: 'desc' });
  });

module.exports = router;
