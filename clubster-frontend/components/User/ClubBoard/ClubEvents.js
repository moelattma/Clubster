import React, { Component } from 'react';
import { View, Dimensions, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import t from 'tcomb-form-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator } from 'react-navigation';
import tx from 'tcomb-additional-types';
import { ImagePicker, Permissions, Constants } from 'expo';
import { Font, AppLoading } from "expo";
import converter from 'base64-arraybuffer';
import { Container, Header, Content, Card,
       CardItem, Thumbnail, Text, Button, Icon,
        Left, Body, Right, Form, Item, Input } from 'native-base';
import EventProfile from './EventProfile';
import Comments from './Comments';
import v1 from 'uuid/v1';
import {accessKeyId, secretAccessKey} from '../../../keys/keys';
import { RNS3 } from 'react-native-aws3';

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

    props.navigation.setParams({ refreshEvents: this.getEvents });

    this._mounted = false;

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

  static navigationOptions = ({ navigation, screenProps }) => {
    rightHeader = (
      <View style={{ marginRight: 6 }}>
        <FontAwesome
          name="plus" size={32} color={'black'}
          onPress={() => navigation.navigate('CreateClubEvent', { refreshEvents: navigation.state.params.refreshEvents })} />
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
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
       if (this._mounted) this.getClubEvents();
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getClubEvents = async () => {
    const { _id } = this.props.screenProps;
    this.setState({ loading: true })
    axios.get(`http://localhost:3000/api/events/${_id}`)
      .then((response) => {
        if (this._mounted) {
          this.setState({ clubEvents: response.data.events.reverse().slice(0, 40), idOfUser: response.data.idOfUser });
          this.setState({ loading: false })
        }
      })
      .catch((err) => { console.log('getClubEvents failed'); console.log(err) });
  }

  _handleGoing = (item) => {
    console.log(item);
    for (var i = 0; i < this.state.clubEvents.length; i++) {
      if (this.state.clubEvents[i]._id === item._id)
        break;
    }
    var clubEvents = this.state.clubEvents;
    var id = this.state.idOfUser;
    axios.post(`http://localhost:3000/api/events/${item._id}`).then((response) => {
      console.log('this is i ', clubEvents[i]);
      clubEvents[i].going = response.data.event.going;
      this.setState({clubEvents:clubEvents});
    })
    .catch((err) => {console.log('error getting Going'); console.log(err)});
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
      this.setState({clubEvents:clubEvents});
    })
    .catch((err) => {console.log('error posting to Likers'); console.log(err)});
  }

  _renderItem = ({ item }) => {
    var hostURL;
    if (item.image)
      hostURL = 'https://s3.amazonaws.com/clubster-123/' + item.host.image;
    else
      hostURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';

    var eventURL;
    if (item.host.image)
      eventURL = 'https://s3.amazonaws.com/clubster-123/' + item.image;
    else
      eventURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';

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
                  <Icon name="thumbs-up" style={{color:'gray'}}/>
                  <Text style={{color:'gray'}}>{item.likers.length} likes</Text>
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
                  <Icon name="star" style={{color:'gray'}}/>
                  <Text style={{color:'gray'}}>{item.going.length} going</Text>
                </Button>
            }
          </Right>
        </CardItem>
      </Card>
    );
  }

  render() {
    if (this.state.loading) {
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
      imageURL: '',
      uri: 'https://image.flaticon.com/icons/png/512/128/128423.png',
      isImageUploaded: false
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
      await RNS3.put(file, options).then((response) => {
        this.setState({
          imageURL: response.body.postResponse.key,
          uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key,
          isImageUploaded: true
        });
      }).catch((err) => { console.log('upload image to aws failed');console.log(err) });
    } catch (error) {console.log('library handle failed'); console.log(error);}
  }

  createEvent = async () => {
    const { _id } = this.props.screenProps;
    const { name, date, time, description, location, imageURL } = this.state;
    var newEvent;
    await axios.post('http://localhost:3000/api/events/'+_id+'/new', {
      name, date, time, description, location, imageURL
    }).then(response => {
      newEvent = response.data.event;
    }).catch(error => console.log(error + 'ruh roh'));
    var func = this.props.navigation.getParam('refreshEvents');
    if (func) {
      await func();
      this.props.navigation.navigate('ShowEvents', { newEvent: newEvent });
    } else this.props.navigation.navigate('ShowEvents', { newEvent: newEvent });
  }

  render() {

    const { name, date, time, description, location } = this.state;

    return (
      <Container>
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
            source={{uri: this.state.uri}} />
      </TouchableOpacity>
      :
      <TouchableOpacity onPress={this.useLibraryHandler}>
          <Thumbnail square style={styles.imageThumbnail}
              source={{uri: this.state.uri}} />
        </TouchableOpacity>
      }
      </Content>



      <Button bordered
            onPress={this.createEvent}
            style={{ margin:20, width:160,
          justifyContent:'center', alignSelf:'center'}}>
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
  uploadIcon:{
    alignSelf: 'center',
    margin: 10,
  },
  imageThumbnail: {
    margin: 20,
    alignSelf: 'center',
    borderRadius: 2,
    width: WIDTH/1.5,
    height: HEIGHT/3
  },
});
