const Organization = require('../Organizations/model');
const mongoose = require('mongoose');

// aggregate query to get side graph data (total likes and comments for club)
exports.getSideGraphs = (req, res) => {
    const { organizationID } = req.params;
    var pipeline = [
        { "$unwind": "$events" },
        {
            "$group": {
                "_id": "$_id",
                "events": { "$push": "$events" },
                "totalLikes": { "$sum": "$likers.length" },
                "totalComments": { "$sum": "$comments.length"}
            }
        }
    ]
    Organization.aggregate(pipeline).exec((err, data) => {  
        if (err) console.log(err);
    });
}

// aggregate query to get attendance data
exports.getEventAttendance = (req, res) => {
    const { organizationID } = req.params;
    Organization.findByIdAndUpdate(organizationID).populate(events).then((organization) => {
        return res.status(201).json({ 'events': organization.events}); //returns organization's events along with idOfUser
    } ) 
}

// aggregate query to get active members data
exports.getActiveChart = (req, res) => {

}