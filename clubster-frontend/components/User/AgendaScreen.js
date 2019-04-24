import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import {Agenda} from 'react-native-calendars';
var moment = require('moment-timezone');

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      events: [{
        _id: {
            "$oid": "5cb81a53601d33408834675f"
        },
        date: [
            1555743600,
            1555743600
        ],
        photos: [],
        going: [
            {
                "$oid": "5c04a79bfd61322588b80309"
            }
        ],
        likers: [
            {
                "$oid": "5c04a79bfd61322588b80309"
            }
        ],
        rides: [],
        comments: [],
        organization: {
            "$oid": "5cb6a9196203c14aa0a66aa1"
        },
        name: "Test 1",
        description: "Test 1",
        host: {
            "$oid": "5c04a79bfd61322588b80309"
        },
        location: "Test 1",
        image: "s3/ed98fa20-61a3-11e9-b39a-0bdefcda8e19.jpeg",
        value: 4,
        __v: 0
      }, {
        _id: {
            "$oid": "5cb81fa5601d334088346761"
        },
        date: [
            1555830000,
            1555830000
        ],
        photos: [],
        going: [
            {
                "$oid": "5c04a79bfd61322588b80309"
            }
        ],
        likers: [
            {
                "$oid": "5c04a79bfd61322588b80309"
            }
        ],
        rides: [],
        comments: [],
        organization: {
            "$oid": "5cb6a9196203c14aa0a66aa1"
        },
        name: "Test 3",
        description: "Test 3",
        host: {
            "$oid": "5c04a79bfd61322588b80309"
        },
        location: "Test 3",
        image: "s3/19d34660-61a7-11e9-9620-af4117ad71ca.jpeg",
        value: 5,
        __v: 0
      }]
    };
  }

  timeToString(time) {
    return moment.tz(time, "America/Los_Angeles").format().split('T')[0];
  }

  processEvents() {
    for(let i = 0;i < this.state.events.length; i++) {
      let begDateTimestamp = this.state.events[i].date[0];
      let endDateTimestamp = this.state.events[i].date[1];
      let date = this.timeToString(begDateTimestamp*1000);
      if (!this.state.items[date]) {
        this.state.items[date] = [];
        this.state.items[date].push({
          name: 'Item for ' + date,
          height: (endDateTimestamp - begDateTimestamp)/60*5
        });
      } else {
        if(endDateTimestamp - begDateTimestamp != 0) {
          this.state.items[date].push({
            name: 'Item for ' + date,
            height: (endDateTimestamp - begDateTimestamp)/60*5
          });
        }
      }
    }
    const newItems = {};
    Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
    this.setState({
      items: newItems
    });

  }

  render() {
    console.log(this.state.items);
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        selected={'2017-05-16'}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#666'},
        //    '2017-05-09': {textColor: '#666'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
         // monthFormat={'yyyy'}
         // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
      />
    );
  }

  loadItems(day) {
    this.processEvents();
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}><Text>{item.name}</Text></View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }


}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex:1,
    paddingTop: 30
  }
});
