import React, { Component, PropTypes } from 'react';

import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image, ART } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import SideGraph from '../Cards/SideGraph';
import EventAttendance from '../Cards/EventAttendance';
import ActiveChart from '../Cards/ActiveChart';
import axios from 'axios';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";

export default class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: [],
      loading: false,
      idOfUser: '',
      name: '',
      description: '',
      date: '',
      location: '',
      time: ''
    }
  }

  componentWillMount() {
    this._mounted = true;
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
      if (this._mounted)
        this.getOrganization();
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  async getOrganization() {
    const { _id } = this.props.screenProps;
    this.setState({ loading: true })
    await axios.get(`http://localhost:3000/api/organizations/getOrg/${_id}`)
      .then((response) => {
        if (this._mounted) {
          console.log(response.data.org);
          this.setState({ club: response.data.org, idOfUser: response.data.idOfUser });
          this.setState({ loading: false })
        }
      })
      .catch((err) => { console.log('getClubEvents failed'); console.log(err) });
    console.log('this is state ', this.state );
  }
  render() {
     var club = this.state.club;
    // if(this.state.club.length<2) {
    //   club.push({name:"hi", going:["harry"]});
    //   club.push({name:"hiyu", going:["ui"]});
    //   this.setState({club:club});
    // }
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
          <SideGraph club = {this.state.club} />
          <ActiveChart club = {this.state.club} />
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
