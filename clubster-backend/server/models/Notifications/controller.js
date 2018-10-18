
/*
* This is the controller for the Notifications schema. In this file, we will code out the methods that will get all the notificatiosn based on the userID.
* author: ayunus@ucsc.edu mmajidi@ucsc.edu
*
*/

//Import Node.js libraries.
const Notifications = require('./model');              //import Notification Schema

exports.grabNotifications = (req, res) => {
  //gets all notifications based on the userid
  const {id} = req.headers; 
  Notifications.find({id: id}).then((notifications) => {
		if (!organizations)
		{
			return res.status(400).json({'Error':'No notifications found'});
		}

		else{
			return res.status(201).json({'notifications': notifications});
		}
	});
};
