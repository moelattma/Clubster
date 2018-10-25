/*
* This is the controller for the Profile schema.
* author: ayunus@ucsc.edu
*/

// grabs scheme in the profile/model
const Profile = require('./model');

exports.profileSubmission = (req, res) => {
    const {major, social, hobbies } = req.body; // destructure, pull value and assign it
    let email = req.user;
    console.log(email);
    // making new profile object
    const newProfile = {
        user: req.user._id,
        major: major,
        hobbies: hobbies.toString().split(','),
        social: {
            youtube: social.youtube,
            facebook: social.facebook,
            linkedin: social.linkedin,
            instagram: social.instagram,
        }
    };

    Profile.findOne({email: email}).then((profile)=>{
        if(profile){
            Profile.findOneAndUpdate(
                {user: req.user._id},
                {$set: newProfile},
                {new: true}
            ).then((profile) => res.json(profile))
        }else{
            new Profile(newProfile).save().then((profile) => res.json(profile));
        }
    });
};
