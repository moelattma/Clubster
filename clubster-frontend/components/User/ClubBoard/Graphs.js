import React, { Component, PropTypes } from 'react';

import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image, ART } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import SideGraph from '../Cards/SideGraph';
import EventAttendance from '../Cards/EventAttendance';
import axios from 'axios';
export default class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubEvents: [],
      loading: false,
      idOfUser: '',
      name: '',
      description: '',
      date: '',
      location: '',
      time: ''
    }
  }

  componentDidMount() {
    this._mounted = true;
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
      if (this._mounted)
        this.getClubEvents();
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getClubEvents() {
    const { _id } = this.props.screenProps;
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/api/events/${_id}`)
      .then((response) => {
        if (this._mounted) {
          this.setState({ clubEvents: response.data.events, idOfUser: response.data.idOfUser });
          this.setState({ loading: false })
        }
      })
      .catch((err) => { console.log('getClubEvents failed'); console.log(err) });
  }
  render() {
    var events = this.state.clubEvents;
    if(this.state.clubEvents.length<2) {
      events.push({name:"hi", going:["harry"]});
      events.push({name:"hiyu", going:["ui"]});
      this.setState({clubEvents:events});
    }

    return (
      <Container>
          <SideGraph events = {events} />
      </Container>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: '#3F51B5',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
});
