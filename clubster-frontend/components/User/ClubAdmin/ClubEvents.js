import React, { Component } from 'react';
import { View, Text, Dimensions, Button, FlatList, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from 'react-navigation';

const Form = t.form.Form;
const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;

const Event = t.struct({
  name: t.String,
  description: t.String,
  date: t.String,
});

export default class ClubEvents extends Component {
  componentWillMount() {
    this._navListenerFocus = this.props.navigation.addListener('willFocus', () => {
      this.props.screenProps.adminNavigation.setParams({ hideHeader: true });
    });
    this._navListenerBlur = this.props.navigation.addListener('willBlur', () => {
      this.props.screenProps.adminNavigation.setParams({ hideHeader: false });
    });
  }

  componentWillUnmount() {
    this._navListenerFocus.remove();
    this._navListenerBlur.remove();
  }

  render() {
    const { _id, clubsterNavigation, adminNavigation } = this.props.screenProps;
    return (
      <ClubEventNavigator screenProps={{ _id, clubsterNavigation, adminNavigation }} />
    );
  }
}

class ShowEvents extends Component {
  constructor() {
    super();

    this.state = {
      clubEvents: [],
      loading: false
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerLeft: (
        <View style={{ marginLeft: 13 }}>
          <MaterialIcons
            name="arrow-back" size={32} color={'black'}
            onPress={() => screenProps.adminNavigation.navigate('HomeNavigation')} />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 6 }}>
          <FontAwesome
            name="plus" size={32} color={'black'}
            onPress={() => navigation.navigate('CreateClubEvent')} />
        </View>
      )
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

  _renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback >
        <View style={styles.eventContainer} >
          <Text style={styles.eventTitle}> {item.name} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <FlatList
          data={this.state.clubEvents.reverse()}
          renderItem={this._renderItem}
          keyExtractor={clubEvent => clubEvent._id}
          refreshing={this.state.loading}
          onRefresh={() => this.getClubEvents()}
        />
      </View>
    );
  }
}

class CreateClubEvent extends Component {
  createEvent = () => {
    const { _id } = this.props.screenProps;
    const name = this._formRef.getValue().name;
    const date = this._formRef.getValue().date;
    const description = this._formRef.getValue().description;
    axios.post(`http://localhost:3000/api/events/${_id}/new`, { name, date, description }).then((event) => {
      this.setState({ clubEvents: this.state.clubEvents.concat(event.data) });
    }).catch((error) => {
      console.log(error);
    });
    this.props.navigation.navigate('ShowEvents');
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Form type={Event} ref={(ref) => this._formRef = ref} />
        <Button title="Create this Event!" onPress={() => this.createEvent()} />
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

const ClubEventNavigator = createStackNavigator(
  {
    ShowEvents: { screen: ShowEvents },
    CreateClubEvent: { screen: CreateClubEvent }
  },
  {
    navigationOptions: {
      headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />),
    }
  }
)