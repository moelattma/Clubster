import React, { Component } from 'react';
import { TouchableHighlight, View, TextInput, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { createStackNavigator } from 'react-navigation';
import tx from 'tcomb-additional-types';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";
import converter from 'base64-arraybuffer';

import {
  Container, Header, Content, Card,
  CardItem, Thumbnail, Text, Button, Icon,
  Left, Body, Right, Form, Item, Input
} from 'native-base';
import EventProfile from './EventProfile';
import Comments from './Comments';
import v1 from 'uuid/v1';
import { accessKeyId, secretAccessKey } from '../../../keys/keys';
import { RNS3 } from 'react-native-aws3';
import { DefaultImg } from '../../router';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const EVENT_WIDTH = WIDTH * 9 / 10;
const EVENT_HEIGHT = HEIGHT * 3 / 7;


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

    props.navigation.setParams({ addEvent: this.addEvent });

    this._mounted = false;

    this.state = {
      clubEvents: [],
      loading: false,
      idOfUser: '',
      editedItem: null,
      name: '',
      description: '',
      date: '',
      location: '',
      time: '',
      imageURL: DefaultImg,
      show: true,
      editModal: false
    }
  }



  static navigationOptions = ({ navigation, screenProps }) => {
    rightHeader = (
      <View style={{ marginRight: 6 }}>
        <FontAwesome
          name="plus" size={32} color={'black'}
          onPress={() => navigation.navigate('CreateClubEvent', { addEvent: navigation.state.params.addEvent })} />
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
    this._mounted = true;
    if (this._mounted) this.getClubEvents();
  }

  componentWillUnmount() { this._mounted = false; }

  getClubEvents = async () => {
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

  addEvent = async (newEvent) => {
    this.setState({ loading: true });
    var events = this.state.clubEvents;
    events.unshift(newEvent);
    this.setState({ clubEvents: events, loading: false });
  }

  // modal for when user enters invalid fields 
  openEditModal( item ) {
    this.setState({
      editedItem: item,
      name: item.name,
      description: item.description,
      time: item.time,
      date: item.date,
      location: item.location,
      editModal: true
    })
  }

  closeEditModal() { this.setState({ editModal: false }) }

  submitEventChanges = () => {
    let { name, description, time, date, location } = this.state;
    if (name == "")
      name = this.state.editedItem.name;
    if (description == "")
      description = this.state.editedItem.description;
    if (time == "")
      time = this.state.editedItem.time
    if (date == "")
      date = this.state.editedItem.date
    if (location == "")
      location = this.state.editedItem.location
    axios.post(`http://localhost:3000/api/events/${this.state.editedItem._id}`, {
      name: this.state.name,
      description: this.state.description,
      time: this.state.time,
      date: this.state.date,
      location: this.state.location
    }).then(() => {
      this.setState({ editModal: false });
    }).catch(() => { return; });
  }

  changePicture = async () => {
    await this.askPermissionsAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          base64: false,
      });
      if(result.cancelled)
        return;
      const key = `${v1()}.jpeg`;
      const file = {
          uri: result.uri,
          type: 'image/jpeg',
          name: key
      };
      const options = {
        keyPrefix: 's3/',
        bucket: 'clubster-123',
        region: 'us-east-1',
        accessKey:accessKeyId,
        secretKey: secretAccessKey,
        successActionStatus:201
      }
      var imageURL;
      await RNS3.put(file,options).then((response)=> {
         imageURL = response.body.postResponse.key;
      }).catch((err) => {console.log(err)});
      axios.post(`http://localhost:3000/api/events/modifyOrgPicture/${this.props.screenProps._id}`, { imageURL }).then((response) => {
          this.setState({ img: (response.data.image ? 'https://s3.amazonaws.com/clubster-123/' + response.data.image : DefaultImg) });
      }).catch((err) => { return; });
      this.props.navigation.navigate('ShowClubs');
    } catch(error) {
      console.log(error);
    };
  };

  _handleGoing = (item) => {
    for (var i = 0; i < this.state.clubEvents.length; i++) {
      if (this.state.clubEvents[i]._id === item._id)
        break;
    }
    var clubEvents = this.state.clubEvents;
    var id = this.state.idOfUser;
    axios.post(`http://localhost:3000/api/events/${item._id}/going`).then((response) => {
      clubEvents[i].going = response.data.event.going;
      this.setState({ clubEvents: clubEvents });
    })
      .catch((err) => { console.log('error getting Going'); console.log(err) });
  }

  _handleLikers = (item) => {
    for (var i = 0; i < this.state.clubEvents.length; i++) {
      if (this.state.clubEvents[i]._id === item._id)
        break;
    }
    var clubEvents = this.state.clubEvents;
    var id = this.state.idOfUser;
    axios.post(`http://localhost:3000/api/events/${item._id}/likers`).then((response) => {
      clubEvents[i].likers = response.data.event.likers;
      this.setState({ clubEvents: clubEvents });
    })
      .catch((err) => { console.log('error posting to Likers'); console.log(err) });
  }

  _renderItem = ({ item }) => {
    var hostURL;
    var eventURL;
    const { name, date, time, description, location } = this.state;
    if (item.image && item.image != null)
      eventURL = 'https://s3.amazonaws.com/clubster-123/' + item.image;
    else
      eventURL = DefaultImg;

    if (item.host.image && item.host.image != null)
      hostURL = 'https://s3.amazonaws.com/clubster-123/' + item.host.image;
    else
      hostURL = DefaultImg;

    if (this.props.screenProps.isAdmin) {
      return (
        <Card>
          <Modal isVisible={this.state.editModal}>
            <View style={styles.modalView}>
              <View>
                <TouchableOpacity onPress={() => this.closeEditModal()}>
                  <Icon name="ios-arrow-dropleft"
                    style={styles.modalButton} />
                </TouchableOpacity>
              </View>
              <View style={styles.textInAreaContainer}>
                <TextInput placeholder='name'
                  style={styles.textInArea}
                  label='name'
                  onChangeText={(name) => this.setState({ name })}
                  //onChangeText={item.name = name}
                  value={this.state.name}
                />
              </View>
              <View style={styles.textInAreaContainer}>
                <TextInput placeholder='location'
                  style={styles.textInArea}
                  label='location'
                  onChangeText={(location) => this.setState({ location })}
                  //onChangeText={item.location = location}
                  value={this.state.location}
                />
              </View>
              <View style={styles.textInAreaContainer}>
                <TextInput placeholder='date'
                  style={styles.textInArea}
                  label='date'
                  onChangeText={(date) => this.setState({ date })}
                  //onChangeText={item.date = date}
                  value={this.state.date}
                />
              </View>
              <View style={styles.textInAreaContainer}>
                <TextInput placeholder='time'
                  style={styles.textInArea}
                  label='time'
                  onChangeText={(time) => this.setState({ time })}
                  //onChangeText={item.time = time}
                  value={this.state.time}
                />
              </View>
              <View style={styles.textInAreaContainer}>
                <TextInput placeholder='description'
                  style={styles.textInArea}
                  label='description'
                  onChangeText={(description) => this.setState({ description })}
                  //onChangeText={item.description = description}
                  value={this.state.description}
                />
              </View>
              <View>
                <Button bordered
                  onPress={() => {this.submitEventChanges() }}
                  style={{
                    margin: 20, width: 160,
                    justifyContent: 'center', alignSelf: 'center'
                  }}>
                  <Text>Update Event!</Text>
                </Button>
              </View>
            </View>
          </Modal>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: hostURL }} />
              <Body>
                <Text>{item.host.name} is hosting {item.name}</Text>
              </Body>
            </Left>
            <Right>
              <Button transparent onPress={() => this.openEditModal( item )}>
                <Text> edit </Text>
              </Button>
              <TouchableOpacity onPressIn={this.changePicture}>
	                    <Thumbnail square style={{ height: 200, width: WIDTH }}
	                        source={{ uri: this.state.img }} />
	            </TouchableOpacity>
            </Right>
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
                < Icon active name="chatbubbles" />
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
      )
    }
    else {
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
      )
    };
  }

  render() {
    if (this.state.loading || !this.state.clubEvents) {
      return <Expo.AppLoading />;
    }
    return (
      <FlatList
        data={this.state.clubEvents}
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

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      date: '',
      location: '',
      time: null,
      timeDisplay: null,
      timeDisplayEnd: null,
      imageURL: null,
      uri: 'https://image.flaticon.com/icons/png/512/128/128423.png',
      isImageUploaded: false,
      chosenDate: new Date(),
      selectedStartDate: null,
      selectedEndDate: null,
      isDateTimePickerVisible: false,
      showDate: false,
      showTime: false,
      showTime2: false,
      validModal: false
    }
    this.setDate = this.setDate.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  _showDateTimePicker = () => this.setState({ showTime: true });

  _hideDateTimePicker = () => this.setState({ showTime: false });

  _hideDateTimePickerTwo = () => this.setState({ showTime2: false });

  hide = () => { return; }

  _showModal = (type) => {
    (type == 1) ? this.setState({ showDate: true }) : (type == 2) ? this.setState({ showTime: true }) : this.setState({ showTime2: true });
  }
  _hideModal = (type) => {
    (type == 1) ? this.setState({ showDate: false }) : (type == 2) ? this.setState({ showTime: false }) : this.setState({ showTime2: false });
  }

  _handleDatePicked = (date) => {
    console.log(date.toString());
    let hour = parseInt(date.toString().substring(date.toString().indexOf(":") - 2, date.toString().indexOf(":")));
    let minutes = parseInt(date.toString().substring(date.toString().indexOf(":") + 1, date.toString().indexOf(":") + 3));
    console.log(hour);
    let ifPM = (hour >= 12) ? " PM" : " AM";
    if (hour == 0) hour = 12;
    else hour -= (hour > 12) ? 12 : 0; //hour = 9, 3:09
    //strHour = (hour < 10) ? hour.toString() : hour.toString();
    strMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
    console.log("hour is: ", hour);
    console.log("minutes is: ", minutes);
    this.setState({ timeDisplay: hour.toString() + ":" + strMinutes + ifPM, dateTimestampStart: date });
    this._hideDateTimePicker();
  };

  _handleDatePickedTwo = (date) => {
    //04:00
    console.log(date);
    let hour = parseInt(date.toString().substring(date.toString().indexOf(":") - 2, date.toString().indexOf(":")));
    let minutes = parseInt(date.toString().substring(date.toString().indexOf(":") + 1, date.toString().indexOf(":") + 3));
    let ifPM = (hour >= 12) ? " PM" : " AM";
    if (hour == 0) hour = 12;
    else hour -= (hour > 12) ? 12 : 0;
    //strHour = (hour < 10) ? "0" + hour.toString() : hour.toString();
    strMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
    console.log("hour is: ", hour);
    console.log("minutes is: ", minutes);
    console.log(hour.toString() + ":" + strMinutes + ifPM);
    this.setState({ timeDisplayEnd: hour.toString() + ":" + strMinutes + ifPM, dateTimestampEnd: date });
    this._hideDateTimePickerTwo();
  };

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  hide = () => { return; }

  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

  useLibraryHandler = async () => {
    await this.askPermissionsAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        base64: false,
      });
      if (result.cancelled)
        return;
      const key = `${v1()}.jpeg`;
      const file = {
        uri: result.uri,
        type: 'image/jpeg',
        name: key
      };
      const options = {
        keyPrefix: 's3/',
        bucket: 'clubster-123',
        region: 'us-east-1',
        accessKey: accessKeyId,
        secretKey: secretAccessKey,
        successActionStatus: 201
      }
      await RNS3.put(file, options).then((response) => {
        this.setState({
          imageURL: response.body.postResponse.key,
          uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key,
          isImageUploaded: true
        });
      }).catch((err) => { console.log('upload image to aws failed'); console.log(err) });
    } catch (error) { console.log('library handle failed'); console.log(error); }
  }

  createEvent = async () => {
    const { _id } = this.props.screenProps;
    const { name, date, time, description, location, imageURL, chosenDate, selectedStartDate, selectedEndDate, timeDisplay, timeDisplayEnd } = this.state;
    var newEvent;
    await axios.post('http://localhost:3000/api/events/' + _id + '/new', {
      name, date, time, description, location, imageURL, chosenDate, selectedStartDate, selectedEndDate, timeDisplay, timeDisplayEnd
    }).then(response => {
      newEvent = response.data.event;
    }).catch(error => console.log(error + 'ruh roh'));
    var func = this.props.navigation.getParam('addEvent');
    if (func) {
      await func(newEvent);
      this.props.navigation.navigate('ShowEvents');
    } else this.props.navigation.navigate('ShowEvents');
  }

  // modal for when user enters invalid fields
  openValidModal() {
    this.setState({
      validModal: true
    })
  }

  closeValidModal() { this.setState({ validModal: false }) }

  validateInput = () => {
    let errors = {};
    if (this.state != null) {
      const { name, date, time, location, description, imageURL } = this.state;

      if (name == "")
        errors['name'] = 'Please enter a name for the event'
      if (date == "")
        errors['date'] = 'Please enter a date'
      if (time == "")
        errors['time'] = 'Please enter a time'
      if (location == "")
        errors['location'] = 'Please enter a location'
      if (description == "")
        errors['description'] = 'Please enter a description'
      this.setState({ errors });
      if (Object.keys(errors).length == 0) {
        this.createEvent();
      }
      else {
        this.openValidModal();
      }
    }
  }

  render() {
    const { name, date, time, description, location } = this.state;
    const { selectedStartDate, selectedEndDate } = this.state;
    let { errors = {} } = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2020, 6, 3);
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';
    return (
      <Container>
        <Form>
          <Item>
            <Input placeholder="Name"
              label='name'
              style={{ fontFamily: "sans-serif" }}
              onChangeText={(name) => this.setState({ name })}
              value={name}
            />
          </Item>
          <Item>
            <Input placeholder="Location"
              label='location'
              style={{ fontFamily: "sans-serif" }}
              onChangeText={(location) => this.setState({ location })}
              value={location}
            />
          </Item>
          <Item>
            <Input placeholder="Description"
              style={{ fontFamily: "sans-serif" }}
              label='description'
              onChangeText={(description) => this.setState({ description })}
              value={description}
            />
          </Item>
          <Item>
            <TouchableOpacity
              onPress={() => {
                this._showModal(1)
              }}
              style={{
                height: 50,
                paddingLeft: 5,
                paddingRight: 5,
                flex: 1,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center'
              }}>
              <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Date</Text>
            </TouchableOpacity>
          </Item>
          <Item>
            <TouchableOpacity
              onPress={() => {
                this._showModal(2)
              }}
              style={{
                height: 50,
                paddingLeft: 5,
                paddingRight: 5,
                flex: 1,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center'
              }}>
              {(this.state.timeDisplay == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>Start Time</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timeDisplay.toString()}</Text>}
            </TouchableOpacity>

          </Item>
          <Item>
            <TouchableOpacity
              onPress={() => {
                this._showModal(3)
              }}
              style={{
                height: 50,
                paddingLeft: 5,
                paddingRight: 5,
                flex: 1,
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center'
              }}>
              {(this.state.timeDisplayEnd == null) ? <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>End Time</Text> : <Text style={{ color: '#575757', fontSize: 17, flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>{this.state.timeDisplayEnd.toString()}</Text>}
            </TouchableOpacity>

          </Item>
        </Form>
        <Content>


          {this.state.isImageUploaded == false
            ?
            <TouchableOpacity onPress={this.useLibraryHandler}>
              <Thumbnail square small style={styles.uploadIcon}
                source={{ uri: this.state.uri }} />
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={this.useLibraryHandler}>
              <Thumbnail square style={styles.imageThumbnail}
                source={{ uri: this.state.uri }} />
            </TouchableOpacity>
          }
        </Content>

        <Modal isVisible={this.state.validModal}>
          <View style={styles.modalStyle}>
            <TouchableOpacity onPress={() => this.closeValidModal()}>
              <Icon name="ios-arrow-dropleft"
                style={styles.modalButton} />
            </TouchableOpacity>
            <Text style={styles.modalContent}>{errors.name}</Text>
            <Text style={styles.modalContent}>{errors.date}</Text>
            <Text style={styles.modalContent}>{errors.time}</Text>
            <Text style={styles.modalContent}>{errors.location}</Text>
            <Text style={styles.modalContent}>{errors.description}</Text>
          </View>
        </Modal>

        {/* MODAL  */}
        <View style={{ flex: 1 }}>
          <Modal isVisible={this.state.showDate} onRequestClose={this.hide}>
            <View style={styles.container}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={true}
                minDate={minDate}
                maxDate={maxDate}
                todayBackgroundColor="#f2e6ff"
                selectedDayColor="#7300e6"
                selectedDayTextColor="#FFFFFF"
                onDateChange={this.onDateChange}
              />

              <View>
                <Text>SELECTED START DATE:{startDate}</Text>
                <Text>SELECTED END DATE:{endDate}</Text>
              </View>
              <Button block onPress={() => { this.setState({ showDate: false }) }} style={styles.button}>
                <Text style={{ color: '#fff' }}> Submit </Text>
              </Button>
              <Button block danger onPress={() => { this.setState({ showDate: false }) }} style={styles.button}>
                <Text style={{ color: '#fff' }}> Cancel </Text>
              </Button>
            </View>
          </Modal>
        </View>

        <View style={{ flex: 1 }}>
          <DateTimePicker
            isVisible={this.state.showTime}
            mode={'time'}
            is24Hour={false}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
          />
        </View>

        <View style={{ flex: 1 }}>
          <DateTimePicker
            isVisible={this.state.showTime2}
            mode={'time'}
            is24Hour={false}
            onConfirm={this._handleDatePickedTwo}
            onCancel={this._hideDateTimePickerTwo}
          />
        </View>

        <Button bordered
          onPress={this.createEvent}
          style={{
            margin: 20, width: 160,
            justifyContent: 'center', alignSelf: 'center'
          }}>
          <Text>Create Event!</Text>
        </Button>
      </Container>
    );
  }
}

const ClubEventNavigator = createStackNavigator(
  {
    ShowEvents: { screen: ShowEvents },
    CreateClubEvent: { screen: CreateClubEvent },
    EventProfile: { screen: EventProfile },
    Comments: { screen: Comments }
  },
  {
    navigationOptions: {
      headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />),
    }
  }
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 100,
  },
  button: {
    margin: 10,
    maxWidth: WIDTH,
    minWidth: WIDTH / 2,
  },
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
  modalStyle: {
    margin: 1,
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    color: 'black',
    fontSize: 40,
    margin: 10
  },
  modalView: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  textInAreaContainer: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    margin: 5,
    padding: 10,
    borderRadius: 5
  },
  textInArea: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
  }
});
