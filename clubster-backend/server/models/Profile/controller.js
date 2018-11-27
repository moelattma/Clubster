/*
* This is the controller for the Profile schema.
* author: ayunus@ucsc.edu
*/

// grabs scheme in the profile/model
const Profile = require('./model');
const mongoose = require('mongoose');
const Img = require('../Images/model');
const fs = require('fs');

exports.changeProfile = (req,res) => {
  var new_img = new Img;
  console.log(req.file);
  new_img.img.data = fs.readFileSync(req.file.path)
  new_img.img.contentType = 'image/jpeg';
  new_img.save().then((image) => {
    Profile.findOne({user: req.user._id}).then((profile)=>{
      if(!profile) {
        return res.status(400).json({'err':'err'});
      } else {
        Profile.findOneAndUpdate(
            {user: req.user._id},
            {$set: {"image": mongoose.Types.ObjectId(image._id)}},    // overwrites the previous profile with new one
            {new: true}
        ).then((profile) => {
          Profile.findOne({user: req.user._id}).populate('image').then((profile) => {
              if(profile)
                return res.status(201).json({'profile':profile});
              else
                return res.status(400).json({'err':'err'});
            })});
        }
    });
  });
};

exports.profileSubmission = (req, res) => {
    const {major, hobbies, Facebook, Instagram, LinkedIn, description} = req.body; // destructure, pull value and assign it

    // making new profile object
    const newProfile = {
        user: req.user._id,
        major: major,
        hobbies: hobbies.toString().split(','),
        social: {
            facebook: Facebook,
            linkedin: LinkedIn,
            instagram: Instagram,
        },
        description: description
    };

    Profile.findOne({user: req.user._id}).then((profile)=>{
        if(profile){
            Profile.findOneAndUpdate(
                {user: req.user._id},
                {$set: newProfile},    // overwrites the previous profile with new one
                {new: true}
            ).then((profile) => {
              Profile.findOne({user: req.user._id}).populate('image').then((profile) => {
                  if(profile)
                    return res.status(201).json({'profile':profile});
                  else
                    return res.status(400).json({'err':'err'});
              });
            })    // if sccueedd the return the profile
        }else{
            new Profile(newProfile).save().then((profile) => res.json(profile));
        }
    });
};



exports.retrieveProfile = (req,res) => {
  const id = req.user._id;
  Profile.findOneAndUpdate({user: id}).then((profile) => {
    Profile.findOne({user: req.user._id}).populate('image').then((profile) => {
        if(profile)
          return res.status(201).json({'profile':profile});
        else
          return res.status(400).json({'err':'err'});
    });
  })
}
