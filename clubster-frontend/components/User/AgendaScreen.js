import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image,
  Dimensions,
  Switch
} from 'react-native';
import SwitchButton from 'switch-button-react-native';
import {Agenda} from 'react-native-calendars';
var moment = require('moment-timezone');
const {height, width} = Dimensions.get('window');

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
      }],
      switch1Value: false
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

  toggleSwitch1 = (value) => {
      this.setState({switch1Value: value})
      console.log('Switch 1 is: ' + value)
   }

  render() {
    console.log(this.state.items);
    return (
      <View style = {styles.container}>
      <SwitchButton
                onValueChange={(val) => this.setState({ activeSwitch: val })}      // this is necessary for this component
                text1 = 'All Events'                        // optional: first text in switch button --- default ON
                text2 = 'Your Events'                       // optional: second text in switch button --- default OFF
                switchWidth = {100}                 // optional: switch width --- default 44
                switchHeight = {44}                 // optional: switch height --- default 100
                switchdirection = 'rtl'             // optional: switch button direction ( ltr and rtl ) --- default ltr
                switchBorderRadius = {100}          // optional: switch border radius --- default oval
                switchSpeedChange = {500}           // optional: button change speed --- default 100
                switchBorderColor = '#d4d4d4'       // optional: switch border color --- default #d4d4d4
                switchBackgroundColor = '#fff'      // optional: switch background color --- default #fff
                btnBorderColor = '#00a4b9'          // optional: button border color --- default #00a4b9
                btnBackgroundColor = '#00bcd4'      // optional: button background color --- default #00bcd4
                fontColor = '#b1b1b1'               // optional: text font color --- default #b1b1b1
                activeFontColor = '#fff'            // optional: active font color --- default #fff
                style = {{marginTop: 30, marginLeft: Dimensions.get('window')/2 - 50}}
            />

            { this.state.activeSwitch === 1 ? console.log('view1') : console.log('view2') }
         <Agenda
           items={this.state.items}
           loadItemsForMonth={this.loadItems.bind(this)}
           selected={'2019-04-16'}
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
      </View>
    );
  }

  loadItems(day) {
    this.processEvents();
  }

  renderItem(item) {
       return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ backgroundColor: "#eee", borderRadius: 10, overflow: "hidden" }}>
          <View>
            <Image
              source={{uri: 'https://s3.amazonaws.com/clubster-123/s3/ed98fa20-61a3-11e9-b39a-0bdefcda8e19.jpeg'
           }}
              style={{
                height: 135,
                width: Dimensions.get('window').width - 70
              }}
            />
          </View>
          <View style={{ padding: 10, width: 155 }}>
            <Text>Title</Text>
            <Text style={{ color: "#777", paddingTop: 5 }}>
              Description of the image
            </Text>
          </View>
        </View>
      </View>
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
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   },
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
  },
  container: {
    ...StyleSheet.absoluteFillObject,   // fill up all screen
    justifyContent: 'flex-end',         // align popup at the bottom
    backgroundColor: 'transparent',     // transparent background
  },
  // Semi-transparent background below popup
  backdrop: {
    ...StyleSheet.absoluteFillObject,   // fill up all screen
    backgroundColor: 'black',
  },
  // Popup
  modal: {
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    margin: 20,
    marginBottom: 0,
  },
  // Movie container
  movieContainer: {
     flexDirection: 'row',
  },
  imageContainer: {
    width: width / 2,
    flex: 1,                            // take up all available space
  },
  image: {
    borderRadius: 10,                   // rounded corners
       // fill up all space in a container
  },
  movieInfo: {
    backgroundColor: 'transparent',     // looks nicier when switching to/from expanded mode
  },
  title: {
    fontSize: 20,
  },
  genre: {
    color: '#BBBBBB',
    fontSize: 14,
  },
  sectionHeader: {
    color: '#AAAAAA',
  },
  // Footer
  footer: {
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: '#673AB7',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  button: {
    color: '#FFFFFF',
    fontSize: 18,
  }
});
