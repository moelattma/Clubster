import React, { Component } from 'react';
import { View, Text, Dimensions, Button, FlatList, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import tx from 'tcomb-additional-types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const Form = t.form.Form;
const Form = t.form.Form;
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

const Event = t.struct({
  name: t.String,
  description: t.String,
  date: t.String,
  expense: tx.Number.Decimal
});

export default class ClubEvents extends Component {
  constructor() {
    super();

    this.state = {
      clubEvents: [],
      showCreateEvent: false,
      loading: false
    }
  }

  componentDidMount() {
    this.getClubEvents();
  }

  getClubEvents() {
    const { _id } = this.props.screenProps;
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/api/events/${_id}`)
      .then((response) => {
        this.setState({ clubEvents: response.data.events });
      });
    this.setState({ loading: false })
  }

  createEvent = () => {
    const { _id } = this.props.screenProps;
    const name = this._formRef.getValue().name;
    const date = this._formRef.getValue().date;
    const description = this._formRef.getValue().description;
    const expense = this._formRef.getValue().expense;
    axios.post(`http://localhost:3000/api/events/${_id}/new`, { name, date, description,expense }).then((event) => {
      this.setState({ clubEvents: this.state.clubEvents.concat(event.data) });
    }).catch((error) => {
      console.log(error);
    });
  }

  _renderItem = ({ item }) => {
    console.log(item);
    return (
      <TouchableWithoutFeedback >
        <View style={styles.eventContainer} >
          <Text style={styles.eventTitle}> {item.name} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderView = () => {
    if (this.state.showCreateEvent) {
      return (
        <View style={{ flex: 1 }}>
          <Form type={Event} ref={(ref) => this._formRef = ref} />
          <Button title="Create an Event!" onPress={() => {this.createEvent(); this.setState({ showCreateEvent: false })}} />
        </View>
      );
    }
    return (
      <View >
        <Button title="Make a new event" onPress={() => {this.setState({ showCreateEvent: true })}} />
        <FlatList
          data={this.state.clubEvents}
          renderItem={this._renderItem}
          keyExtractor={clubEvent => clubEvent._id}
          refreshing={this.state.loading}
          onRefresh={() => this.getClubEvents()}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 0,
    backgroundColor: '#3AC8D5',
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

/*
  renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={{ marginLeft: 14, marginRight: 4 }} onPress={() => this.props.navigation.navigate('ClubPage')} >
          <MaterialIcons name="arrow-back" size={32} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', right: 5, justifyContent: 'center' }} >
          <FontAwesome name="plus" size={32} color={'black'} />
        </TouchableOpacity>
      </View>
    );
  }
*/
