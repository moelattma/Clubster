// Rides controller
/*
* This is the controller for the Rides schema.
*/

// grabs scheme in the profile/model
const Rides = require('./model');
const Events = require('../Events/model');

exports.createRide = (req, res) => {
  const { eventID } = req.params;
  const { passengerSeats, description } = req.body;
  const { _id } = req.user;
  let newRide = new Rides({
    driverID: _id,
    ridersID: [],
    passengerSeats: passengerSeats,
    description: description
  });
  
  newRide.save().then( ride => {
    Events.addEventRide(eventID, ride._id);
    return res.status(201).json({ 'ride': ride });
  })
};

exports.joinRide = (req, res) => {
  const { rideID } = req.params;
  const { _id } = req.user;
  Rides.findByIdAndUpdate(rideID).then((ride) => {
    if (!ride){
      return res.status(400).json({ 'Error': 'No such ride exists' }); //DNE, doesnt exist
    } else if (ride.ridersID.length >= ride.passengerSeats) {
      return res.status(400).json({ 'Error': 'Ride is full!' }); //DNE, doesnt exist
    } else {
      Rides.addRider(rideID, _id);
      return res.status(201).json({ 'ride': ride });
    }
  })
};

exports.getRides = (req, res) => {
  Events.findById(req.body.eventID).select("rides")
  .populate({ path: 'rides', populate: { path: 'driverID', populate: { path: 'image', select: 'name image' } }})
  .populate({ path: 'rides', populate: { path: 'ridersID', populate: { path: 'image', select: 'name image' } }}).then((event) => {
    console.log(rides);
  });
};
