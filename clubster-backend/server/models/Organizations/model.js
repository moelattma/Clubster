/*
* Model for Profile.
* Author: ayunus@ucsc.edu
* Class: CS115
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Events = require('../Events/model');

/*
* Creation of User Schema. We specify a const variable with fields: name, email, password, avatar, array of clubs where user is member, and array of clubs where user is admin.
*/
const Organization = new Schema({
  president: {
    type: String,   //Specifiers
    required: true
  },
  admins: [{
    admin: {
      type: Schema.Types.ObjectId,   //Specifiers
      ref: 'users'
    },
    activeScore: 0
  }],
  name: {
    type: String
  },
  description: {
      type: String,
      trim: true,
      unique: true
  },
  image: {
    type: String
  },
  channels: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'channels'
  }],
  social: {
    facebook: {
      type: String
    },
    snapchat: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  members: [{
    member: {
      type: Schema.Types.ObjectId,   //Specifiers
      ref: 'users'
    },
    activeScore: 0
  }],
  events: [{
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'events',
    time: Date.now()
  }],
  gallery: {
    type: Schema.Types.ObjectId,   //Specifiers
    ref: 'galleries',
  },
  totalComments: {
    type: Number
  },
  totalLikes: {
    type: Number
  }
});

Organization.methods.updateInfoByIndex = function(index) {
    if(this.members[index].activeScore > 0) {
      this.members[index].activeScore= this.members[index].activeScore - 1;
    }
    let i = 0;
    while(i<this.admins.length) {
      if(this.members[i].activeScore > 0 && this.admins[i].admin == this.members[index].member) {
          this.admins[i].activeScore= this.admins[i].activeScore - 1;
      }
      ++i;
    }
}

Organization.statics.modifyActiveScore = async function(organizationID, memberID, type) {
  let prevValue = 0;
  await this.findByIdAndUpdate(organizationID).then((organization)=> {
    for(let i = 0;i<organization.members.length;i++) {
      if((organization.members[i].member).equals(memberID)) {
        prevValue = organization.members[i].activeScore;
        break;
      }
    }
  });
  (type == -1) ? prevValue -= 1 : prevValue += 1;
  if(prevValue < 0) {
    prevValue = 0;
  }
  await this.update({"_id": organizationID, "members.member": memberID}, {$set: {"members.$.activeScore": prevValue}});
}

Organization.statics.addMemberToClub = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(organizationID, { $push: { members: { member: memberID, activeScore: 0 } } });
  await this.findByIdAndUpdate(organizationID, {$set:{}}).populate('members.member').populate('events').then((organization) => {
    for(let i = 0;i<organization.members.length;i++) {
      organization.updateInfoByIndex(i);
    }
    for(let j = 0;j<organization.events.length;j++) {
      if(organization.events[j].value <= 5 && organization.events[j].value > 0) {
        Events.updateInfoByIndex(organization.events[j]._id);
      }
    }
  });
}
Organization.statics.increaseComments = async function(organizationID) {
  await this.update({_id:organizationID}, { $inc: {totalComments:1 }});
}

Organization.statics.increaseLikes = async function(organizationID) {
  await this.update({_id:organizationID}, { $inc: {totalLikes:1 }});
}

Organization.statics.decreaseComments = async function(organizationID) {
  await this.update({_id:organizationID}, { $inc: {totalComments:-1 }});
}

Organization.statics.decreaseLikes = async function(organizationID) {
  await this.update({_id:organizationID}, { $inc: {totalLikes:-1 }});
}

Organization.statics.updateInfoByIndex = async function(eventID) {
  await this.update({_id:eventID}, { $inc: {value:-1 }});
}

Organization.statics.addAdminToClub = async function(organizationID, adminID) {
  await this.findByIdAndUpdate(organizationID, { $push: { admins: { admin: adminID, activeScore:0 } } });
  await this.findByIdAndUpdate(organizationID, { $push: { members: { member: adminID, activeScore:0 } } });
}

Organization.statics.deleteClubMember = async function(organizationID, memberID) {
  await this.findByIdAndUpdate(organizationID, { $pull: { members: { member:memberID } } });
}

Organization.statics.addPhoto = async function(organizationID, url) {
  await this.findByIdAndUpdate(organizationID, { $push: { photos: url } });
}

Organization.statics.addEventToClub = async function(organizationID, eventID) {
  await this.findByIdAndUpdate(organizationID, {$set:{}}).populate('members.member').populate('events').then((organization) => {
    for(let i = 0;i<organization.members.length;i++) {
      organization.updateInfoByIndex(i);
    }
    for(let j = 0;j<organization.events.length;j++) {
      if(organization.events[j].value <= 5 && organization.events[j].value > 0) {
        Events.updateInfoByIndex(organization.events[j]._id);
      }
    }
  });
  await this.findByIdAndUpdate(organizationID, { $push: { events: { $each: [eventID], $position: 0 } } });
}

/*
* Export so that other js files can use this schema
*/
module.exports = mongoose.model('organizations', Organization);
