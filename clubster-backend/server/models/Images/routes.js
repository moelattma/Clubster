/*
* This is the routes file for the Images schema. Based on the url axios has inside, the appropriate function will execute
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*/
const fs = require('fs');
const multer = require('multer');
const router = require('express').Router();
var upload = multer({ dest: 'uploads/' });
const Img = require('./model');
const AWS = require('aws-sdk');
const {accessKeyId,secretAccessKey} = require('../../../keys/keys');
const uuid = require('uuid/v1');
const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

router.post('/img_data', upload.single('fileData'), function(req, res) {
  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'qwerty-bucket',
      ContentType: 'image/jpeg',
      Key: key
    },
    (err, url) => res.send({ key, url })
  );
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
