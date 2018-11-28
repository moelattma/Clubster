import React, { Component } from 'react';
import { View, Text, Dimensions, Button, FlatList, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from 'react-navigation';
import tx from 'tcomb-additional-types';

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
  componentWillMount() {
    this._navListenerFocus = this.props.navigation.addListener('willFocus', () => {
      this.props.screenProps.clubBoardNav.setParams({ hideHeader: true });
    });
    this._navListenerBlur = this.props.navigation.addListener('willBlur', () => {
      this.props.screenProps.clubBoardNav.setParams({ hideHeader: false });
    });
  }

  componentWillUnmount() {
    this._navListenerFocus.remove();
    this._navListenerBlur.remove();
  }

  render() {
    const { _id, clubsterNavigation, clubBoardNav, isAdmin } = this.props.screenProps;
    return (
      <ClubEventNavigator screenProps={{ _id, clubsterNavigation, clubBoardNav, isAdmin }} />
    );
  }
}

class ShowEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clubEvents: [],
      loading: false
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    rightHeader = (
      <View style={{ marginRight: 6 }}>
        <FontAwesome
          name="plus" size={32} color={'black'}
          onPress={() => navigation.navigate('CreateClubEvent')} />
      </View>);

    return {
      headerLeft: (
        <View style={{ marginLeft: 13 }}>
          <MaterialIcons
            name="arrow-back" size={32} color={'black'}
            onPress={() => screenProps.clubBoardNav.navigate('HomeNavigation')} />
        </View>
      ),
      headerRight: (screenProps.isAdmin ? rightHeader : null)
    }
  }

  componentWillMount() {
    this.getClubEvents();
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
      this.getClubEvents();
    });
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
      <TouchableWithoutFeedback style={styles.eventCard}>
        <View style={styles.eventContainer} >
          <Text style={styles.eventTitle}> {item.name} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.clubEvents.reverse().slice(0, 20)}
        renderItem={this._renderItem}
        keyExtractor={clubEvent => clubEvent._id}
        ItemSeparatorComponent={this.renderSeparator}
        refreshing={this.state.loading}
        onRefresh={() => this.getClubEvents()}
      />
    );
  }
}

class CreateClubEvent extends Component {
  createEvent = () => {
    var clubEventsNew = [];
    const { _id } = this.props.screenProps;
    const name = this._formRef.getValue().name;
    const date = this._formRef.getValue().date;
    const description = this._formRef.getValue().description;
    const expense = this._formRef.getValue().expense;
    axios.post(`http://localhost:3000/api/events/${_id}/new`, { name, date, description, expense }).then((response) => {
      if(response.status == 201)
        this.props.navigation.navigate('ShowEvents');
    });
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

const styles = StyleSheet.create({
  eventCard: {
    flex: 1,
    backgroundColor: 'lavender',
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 3
  },
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
