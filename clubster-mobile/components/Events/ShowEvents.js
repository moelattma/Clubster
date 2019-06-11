import React from 'react';
import { View, Dimensions, FlatList, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios';
import { Header } from 'react-native-elements';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { DefaultImg } from '../Utils/Defaults';
import { EVENTS_SETCLUB, EVENTS_SETCURRENT, EVENTS_HANDLEGOING, EVENTS_HANDLELIKE } from '../../reducers/ActionTypes'
var moment = require('moment-timezone');

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

export class ShowEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      name: '',
      description: '',
      date: '',
      location: '',
      time: '',
      times: [
        {
          day: 'January 13',
          timeStart: '4:00 PM',
          timeEnd: '6:00 PM',
          location: 'Mohamed\'s casa'
        },
        {
          day: 'May 28',
          timeStart: '8:00 AM',
          timeEnd: '9:45 AM',
          location: 'Social Sciences 1 110'
        }
      ]
    }
  }

  getClubEvents = () => {
    this.setState({ loading: true })
    axios.get(`https://clubster-backend.herokuapp.com/api/events/${this.props.clubID}`)
      .then((response) => {
        this.props.setClubEvents(response.data.events);
        this.setState({ loading: false })
      })
      .catch((err) => { console.log('getClubEvents failed'); console.log(err) });
  }

  convertTime = (timestamp) => {
    console.log(moment.tz(timestamp, "America/Los_Angeles").format().split('T')[0]);
    console.log(moment.tz(timestamp, "America/Los_Angeles").format().split('T')[1]);
    return moment.tz(timestamp, "America/Los_Angeles").format().split('T')[1];
  }

  _handleGoing = (item) => {
    axios.post(`https://clubster-backend.herokuapp.com/api/events/${item._id}/going`).then((response) => {
      this.props._handleGoing(item._id, response.data.event.going);
    }).catch((err) => { console.log('error getting Going'); console.log(err) });
  }

  _handleLikers = (item) => {
    axios.post(`https://clubster-backend.herokuapp.com/api/events/${item._id}/likers`).then((response) => {
      this.props._handleLikers(item._id, response.data.event.likers);
    }).catch((err) => { console.log('error posting to Likers'); console.log(err) });
  }

  _renderItem = ({ item }) => {
    var hostURL;
    var eventURL;
    if (item.image && item.image != null)
      eventURL = 'https://s3.amazonaws.com/clubster-123/' + item.image;
    else
      eventURL = DefaultImg;

    if (item.host.image && item.host.image != null)
      hostURL = 'https://s3.amazonaws.com/clubster-123/' + item.host.image;
    else
      hostURL = DefaultImg;

    const chosen = this.state.times[Math.random() > .5 ? 0 : 1];

    const startYear = item.date.toString().split("Z")[0].split("T")[0].split("-")[0];
    var startMonth = item.date.toString().split("Z")[0].split("T")[0].split("-")[1];
    const startDay = item.date.toString().split("Z")[0].split("T")[0].split("-")[2];

    const endYear = item.date.toString().split("Z")[1].split("T")[0].split("-")[0];
    var endMonth = item.date.toString().split("Z")[1].split("T")[0].split("-")[1];
    const endDay = item.date.toString().split("Z")[1].split("T")[0].split("-")[2];

    const startHour = item.date.toString().split("Z")[0].split("T")[1].split(":")[0];
    const startMin = item.date.toString().split("Z")[0].split("T")[1].split(":")[1];

    const endHour = item.date.toString().split("Z")[1].split("T")[1].split(":")[0];
    const endMin = item.date.toString().split("Z")[1].split("T")[1].split(":")[1];

    switch (startMonth) {
      case "01":
        startMonth = "January";
        break;
      case "02":
        startMonth = "February";
        break;
      case "03":
        startMonth = "March";
        break;
      case "04":
        startMonth = "April";
        break;
      case "05":
        startMonth = "May";
        break;
      case "06":
        startMonth = "June";
        break;
      case "07":
        startMonth = "July";
        break;
      case "08":
        startMonth = "August";
        break;
      case "09":
        startMonth = "September";
        break;
      case "10":
        startMonth = "October";
        break;
      case "11":
        startMonth = "November";
        break;
      case "12":
        startMonth = "December";
        break;
      default:
        startMonth = "January";
        break;
    }

    switch (endMonth) {
      case "01":
        endMonth = "January";
        break;
      case "02":
        endMonth = "February";
        break;
      case "03":
        endMonth = "March";
        break;
      case "04":
        endMonth = "April";
        break;
      case "05":
        endMonth = "May";
        break;
      case "06":
        endMonth = "June";
        break;
      case "07":
        endMonth = "July";
        break;
      case "08":
        endMonth = "August";
        break;
      case "09":
        endMonth = "September";
        break;
      case "10":
        endMonth = "October";
        break;
      case "11":
        endMonth = "November";
        break;
      case "12":
        endMonth = "December";
        break;
      default:
        endMonth = "January";
        break;
    }

    const printDate = startMonth + " " + startDay + ", " + startYear + " at " +
      startHour + ":" + startMin + " to " + endMonth + " " + endDay + endYear + " at " +
      endHour + ":" + endMin;
    item.date = printDate;

    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: hostURL }} />
            <Body>
              <Text>{item.host.name} is hosting {item.name}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image source={{ uri: eventURL }} style={{ height: 200, width: null, flex: 1 }} />
        </CardItem>
        <CardItem>
          <Left>
            <Body>
              <Text note>{printDate}</Text>
              <Text note>at {item.location}</Text>
            </Body>
          </Left>
          <Right>
            <Button bordered onPress={() => {
              axios.get(`https://clubster-backend.herokuapp.com/api/events/getClubEvent/${item._id}`).then((response) => {
                this.props._setCurrentEvent(response.data.clubEvent);
                this.props.navigation.navigate('EventProfile');
              });
            }}>
              <Text>Know More</Text>
            </Button>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            {
              item.likers && item.likers.indexOf(this.props.userID) > -1 ?
                <Button transparent onPress={() => this._handleLikers(item)}>
                  <Icon name="thumbs-up" />
                  <Text>{item.likers.length} likes</Text>
                </Button> :
                <Button transparent onPress={() => this._handleLikers(item)}>
                  <Icon name="thumbs-up" style={{ color: 'gray' }} />
                  <Text style={{ color: 'gray' }}>{item.likers.length} likes</Text>
                </Button>
            }
          </Left>
          <Body>
            <Button transparent onPress={() => this.props.navigation.navigate('Comments', { eventID: item._id })}>
              <Icon active name="chatbubbles" />
              <Text>{item.comments.length} comments</Text>
            </Button>
          </Body>
          <Right>
            {
              item.going && item.going.indexOf(this.props.userID) > -1 ?
                <Button transparent onPress={() => this._handleGoing(item)}>
                  <Icon active name="star" />
                  <Text>{item.going.length} going</Text>
                </Button> :
                <Button transparent onPress={() => this._handleGoing(item)}>
                  <Icon name="star" style={{ color: 'gray' }} />
                  <Text style={{ color: 'gray' }}>{item.going.length} going</Text>
                </Button>
            }
          </Right>
        </CardItem>
      </Card>
    );
  }

  render() {
    return (
      <ScrollView refreshControl={<RefreshControl
        refreshing={this.state.loading}
        onRefresh={() => this.getClubEvents()}
      />}>
        <Header
          backgroundColor={'transparent'}
          leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.navigate('HomeNavigation') }}
          centerComponent={{ text: this.props.clubName + ' Events', style: { fontSize: 21, fontWeight: '500' } }}
          rightComponent={this.props.isAdmin ? { icon: 'add', onPress: (() => this.props.navigation.navigate('CreateEvent')) } : null}
        />
        {!this.props.clubEvents || this.props.clubEvents.length == 0 ?
          <Text style={[{ flex: 1 }, styles.noneText]}>{this.props.clubName} does not have any events yet!</Text>
          :
          <FlatList
            data={this.props.clubEvents.slice(0, 4)}
            renderItem={this._renderItem}
            keyExtractor={clubEvent => clubEvent._id}
            ItemSeparatorComponent={this.renderSeparator}
            extraData={this.props.updateStuff}
          />
        }
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { _id, name, isAdmin } = state.clubs.club;

  return {
    clubID: _id, clubName: name, clubEvents: state.events.clubEvents, isAdmin, userID: state.user.user._id, updateStuff: Math.random()
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setClubEvents: (events) => dispatch({
      type: EVENTS_SETCLUB,
      payload: { events }
    }),
    _setCurrentEvent: (thisEvent) => dispatch({
      type: EVENTS_SETCURRENT,
      payload: { thisEvent }
    }),
    _handleGoing: (corrID, going) => dispatch({
      type: EVENTS_HANDLEGOING,
      payload: { corrID, going }
    }),
    _handleLikers: (corrID, likers) => dispatch({
      type: EVENTS_HANDLELIKE,
      payload: { corrID, likers }
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowEvents);

const styles = StyleSheet.create({
  eventCard: {
    flex: 1,
    backgroundColor: 'lavender',
    marginVertical: 3,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  },
  eventContainer: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 0,
    height: EVENT_HEIGHT,
    width: EVENT_WIDTH,
    alignSelf: 'center',
    marginTop: 25
  },
  eventTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 5,
    flex: 1
  },
  eventTitle2: {
    position: 'absolute',
    right: 2,
    top: 2,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20
  },
  uploadIcon: {
    alignSelf: 'center',
    margin: 10,
  },
  imageThumbnail: {
    margin: 20,
    alignSelf: 'center',
    borderRadius: 2,
    width: WIDTH / 1.5,
    height: HEIGHT / 3
  },
  noneText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontSize: 16,
    marginTop: 10
  }
});
