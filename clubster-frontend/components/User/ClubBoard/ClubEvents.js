import React, { Component } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
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
      name: '',
      description: '',
      date: '',
      location: '',
      time: '',
      imageURL: DefaultImg,
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
  openEditModal() {
    this.setState({
      editModal: true
    })
  }

  closeEditModal() { this.setState({ editModal: false }) }

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
            <View style={styles.formStyle}>
              <TouchableOpacity onPress={() => this.closeEditModal()}>
                <Icon name="ios-arrow-dropleft"
                  style={styles.modalButton} />
              </TouchableOpacity>
              <Form>
                <Input placeholder={item.name}
                  style={styles.modalContent}
                  label='name'
                  onChangeText={(name) => this.setState({ name })}
                  //onChangeText={item.name = name}
                  value={name}
                />
                <Input placeholder={item.location}
                  style={styles.modalContent}
                  label='location'
                  onChangeText={(location) => this.setState({ location })}
                  //onChangeText={item.location = location}
                  value={location}
                />
                <Input placeholder={item.date}
                  style={styles.modalContent}
                  label='date'
                  onChangeText={(date) => this.setState({ date })}
                  //onChangeText={item.date = date}
                  value={date}
                />
                <Input placeholder={item.time}
                  style={styles.modalContent}
                  label='time'
                  onChangeText={(time) => this.setState({ time })}
                  //onChangeText={item.time = time}
                  value={time}
                />
                <Input placeholder={item.description}
                  style={styles.modalContent}
                  label='description'
                  onChangeText={(description) => this.setState({ name })}
                  //onChangeText={item.description = description}
                  value={description}
                />
              </Form>
              <Button bordered
                onPress={this.validateInput}
                style={{
                  margin: 20, width: 160,
                  justifyContent: 'center', alignSelf: 'center'
                }}>
                <Text>Create Event!</Text>
              </Button>
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
              <Button transparent onPress={() => this.openEditModal()}>
                <Text> edit </Text>
              </Button>
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
      time: '',
      imageURL: null,
      uri: 'https://image.flaticon.com/icons/png/512/128/128423.png',
      isImageUploaded: false,
      validModal: false
    }
  }

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
    const { name, date, time, description, location, imageURL } = this.state;
    var newEvent;
    await axios.post('http://localhost:3000/api/events/' + _id + '/new', {
      name, date, time, description, location, imageURL
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
    let { errors = {} } = this.state;

    return (
      <Container>
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

        <Form>
          <Item>
            <Input placeholder="Name"
              label='name'
              onChangeText={(name) => this.setState({ name })}
              value={name}
            />
          </Item>
          <Item>
            <Input placeholder="Date"
              label='date'
              onChangeText={(date) => this.setState({ date })}
              value={date}
            />
          </Item>
          <Item>
            <Input placeholder="Time"
              label='time'
              onChangeText={(time) => this.setState({ time })}
              value={time}
            />
          </Item>
          <Item>
            <Input placeholder="Location"
              label='location'
              onChangeText={(location) => this.setState({ location })}
              value={location}
            />
          </Item>
          <Item>
            <Input placeholder="Description"
              label='description'
              onChangeText={(description) => this.setState({ description })}
              value={description}
            />
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

        <Button bordered
          onPress={this.validateInput}
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
  formStyle: {
    color: 'black',
    flex: 1,
    backgroundColor: "white",
    margin: 4
  },
});
