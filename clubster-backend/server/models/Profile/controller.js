/*
* This is the controller for the Profile schema.
* author: ayunus@ucsc.edu
*/

// grabs scheme in the profile/model 
const Profile = require('./model');

exports.profileSubmission = (req, res) => {
    console.log(req.body);
    const {major, social, hobbies } = req.body; // destructure, pull value and assign it
    console.log(hobbies);
    let id = "5bcf8d006097c0496c0c705";
    let email = "obareach@ucsc.edu";
    // making new profile object
    const newProfile = {
        user: id,
        major: major,
        hobbies: hobbies.split(','),
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
                {user: id},
                {$set: newProfile},
                {new: true}
            ).then((profile) => res.json(profile))
        }else{
            new Profile(newProfile).save().then((profile) => res.json(profile));
        }
    });
};
