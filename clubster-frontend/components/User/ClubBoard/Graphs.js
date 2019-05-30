// graphs page
// sidegraph, activeness graph, participation graph

import React, { Component, PropTypes } from 'react';

import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image, ART, YellowBox } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import SideGraph from '../Cards/SideGraph';
import ActiveChart from '../Cards/ActiveChart';
import axios from 'axios';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";
import { BarChart, XAxis, Grid } from 'react-native-svg-charts';
import * as scale from '../../../node_modules/react-native-svg-charts/node_modules/d3-scale';

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
      time: '',
      data: [6],
      names: []
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
    this.setState({ loading: true });
    let eventLengths = [];
    let eventNames = [];
    await axios.get(`http://localhost:3000/api/organizations/getOrg/${_id}`)
      .then((response) => {
        if (this._mounted) {
          this.setState({ club: response.data.org, idOfUser: response.data.idOfUser });
          this.setState({ loading: false })
        }
      })
      .catch((err) => { console.log('getClubEvents failed'); console.log(err) });
      for(let i = 0;i<this.state.club.events.length;i++) {
        eventLengths.push(this.state.club.events[i].going.length);
        eventNames.push(this.state.club.events[i].name.substring(0,2))
      }
      this.setState({data:eventLengths});
      this.setState({names: eventNames});
  }
  render() {
     var club = this.state.club;
     console.disableYellowBox = true;
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }

    return (
      <Container>
          <SideGraph club = {this.state.club} />
          <ActiveChart club = {this.state.club} />
          {(this.state.data != null && this.state.data.length != 0) ?
          <View style={{ height: 200, padding: 20 }}>
               <BarChart
                   style={{ flex: 1 }}
                   data={this.state.data}
                   gridMin={0}
                   svg={{ fill: 'rgb(134, 65, 244)' }}
               />
               <XAxis
                   style={{ marginTop: 10 }}
                   data={ this.state.names }
                   xAccessor={({ index }) => index}
                   scale={scale.scaleBand}
                   formatLabel={(_, index) => this.state.names[ index ]}
                   labelStyle={ { color: 'black' } }
               />
           </View> :
           null
         }
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
