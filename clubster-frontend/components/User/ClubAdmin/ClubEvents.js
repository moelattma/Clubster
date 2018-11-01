import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { List } from 'react-native-elements';
import axios from 'axios';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

export default class ClubEvents extends Component {
  constructor() {
    super();

    this.state = {
      clubEvents: [],
      loading: false
    }
  }

  componentWillMount() {
    this.getClubEvents();
  }

  getClubEvents() {
    const { organization } = this.props.screenProps;
    console.log(organization);
    axios.get(`http://localhost:3000/api/events/${organization._id}`)
      .then((response) => {
        this.setState({ clubEvents: response.data.events });
        console.log(response.data.events);
      });
  }


  _renderItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableOpacity style={styles.eventContainer} >
        <Text style={styles.eventTitle}> {item.name} </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.clubEvents}
        renderItem={this._renderItem}
        keyExtractor={clubEvent => clubEvent._id}
        refreshing={this.state.loading}
        onRefresh={() => this.getClubEvents()}
      />
    );
  }
}

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 0,
    backgroundColor: '#ff99ff',
    height: EVENT_HEIGHT,
    width: EVENT_WIDTH,
    alignSelf: 'center',
    marginTop: 25
  },
  eventTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 5
  }
});
