import React from 'react';
import { View, Dimensions, FlatList, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux'
import axios from 'axios';
import { Header } from 'react-native-elements'
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import { DefaultImg } from '../Utils/Defaults';
import { EVENTS_SETCLUB } from '../../reducers/ActionTypes'

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
      imageURL: DefaultImg
    }
  }

  getClubEvents = () => {
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/api/events/${this.props.clubID}`)
      .then((response) => {
        this.props.setClubEvents(response.data.events);
        this.setState({ loading: false })
      })
      .catch((err) => { console.log('getClubEvents failed'); console.log(err) });
  }

  _handleGoing = (item) => {
    for (var i = 0; i < this.props.clubEvents.length; i++) {
      if (this.props.clubEvents[i]._id === item._id)
        break;
    }
    var clubEvents = this.props.clubEvents;
    axios.post(`http://localhost:3000/api/events/${item._id}/going`).then((response) => {
      clubEvents[i].going = response.data.event.going;
      this.setState({ clubEvents: clubEvents });
    })
      .catch((err) => { console.log('error getting Going'); console.log(err) });
  }

  _handleLikers = (item) => {
    for (var i = 0; i < this.props.clubEvents.length; i++) {
      if (this.props.clubEvents[i]._id === item._id)
        break;
    }
    var clubEvents = this.props.clubEvents;
    axios.post(`http://localhost:3000/api/events/${item._id}/likers`).then((response) => {
      clubEvents[i].likers = response.data.event.likers;
      this.setState({ clubEvents: clubEvents });
    })
      .catch((err) => { console.log('error posting to Likers'); console.log(err) });
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
              <Text note>{item.time} on {item.date}</Text>
              <Text note>{item.location}</Text>
            </Body>
          </Left>
          <Right>
            <Button bordered onPress={() => this.props.navigation.navigate('EventProfile', { event: item })}>
              <Text>Know More</Text>
            </Button>
          </Right>
        </CardItem>
        <CardItem>
          <Left>
            {
              item.likers && item.likers.indexOf(this.state.idOfUser) > -1 ?
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
              item.going && item.going.indexOf(this.state.idOfUser) > -1 ?
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
      <View>
        <Header
          backgroundColor={'transparent'}
          leftComponent={{ icon: 'arrow-back', onPress: () => this.props.navigation.navigate('HomeNavigation') }}
          centerComponent={{ text: this.props.clubName + ' Events', style: { fontSize: 24, fontWeight: '500' } }}
          rightComponent={this.props.isAdmin ? { icon: 'add', onPress: (() => this.props.navigation.navigate('CreateEvent')) } : null}
        />
        <FlatList
          data={this.props.clubEvents.slice(0, 4)}
          renderItem={this._renderItem}
          keyExtractor={clubEvent => clubEvent._id}
          ItemSeparatorComponent={this.renderSeparator}
          refreshing={this.state.loading}
          onRefresh={() => this.getClubEvents()}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { _id, name } = state.clubs.club;
  return {
    clubID: _id, clubName: name, clubEvents: state.events.clubEvents
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setClubEvents: (events) => dispatch({
          type: EVENTS_SETCLUB,
          payload: { events }
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
});
