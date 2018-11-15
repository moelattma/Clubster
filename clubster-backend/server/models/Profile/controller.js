/*
* This is the controller for the Profile schema.
* author: ayunus@ucsc.edu
*/

// grabs scheme in the profile/model
const Profile = require('./model');

exports.profileSubmission = (req, res) => {
    const {major, hobbies, Facebook, Instagram, LinkedIn} = req.body; // destructure, pull value and assign it

    // making new profile object
    const newProfile = {
        user: req.user._id,
        major: major,
        hobbies: hobbies.toString().split(','),
        social: {
            facebook: Facebook,
            linkedin: LinkedIn,
            instagram: Instagram,
        }
    };

    Profile.findOne({user: req.user._id}).then((profile)=>{
        if(profile){
            Profile.findOneAndUpdate(
                {user: req.user._id},
                {$set: newProfile},    // overwrites the previous profile with new one
                {new: true}
            ).then((profile) => res.json(profile))    // if sccueedd the return the profile 
        }else{
            new Profile(newProfile).save().then((profile) => res.json(profile));
        }
    });
};
