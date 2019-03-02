/*
* This is the controller for the Rides schema.
*/

// grabs scheme in the profile/model
const User = require('../Users/model');
const Profile = require('./model');
const mongoose = require('mongoose');
const fs = require('fs');
const Rides = require('./model');
const Events = require('./../Events/model');

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
    return res.status(201).json({ 'ride':ride });
  })
};

exports.joinRide = (req, res) => {
  const { eventID, rideID } = req.params;
  const { passengerSeats, description } = req.body;
  const { _id } = req.user;
  Rides.findByIdAndUpdate(rideID).then((ride) => {
    if(!ride){
      return res.status(400).json({ 'Error': 'No such ride exists' }); //DNE, doesnt exist
    }
    else{

    }
  })


};

exports.getRides = (req, res) => {
  
};
