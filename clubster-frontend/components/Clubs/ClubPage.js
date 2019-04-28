import React, { Component } from 'react';
import {
  Image, StyleSheet, Text, TouchableOpacity, View,
  Dimensions, TouchableWithoutFeedback, FlatList, ScrollView,
  RefreshControl
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Modal from 'react-native-modal';
import { ImagePicker, Permissions, Font } from 'expo';
import converter from 'base64-arraybuffer';
import v1 from 'uuid/v1';
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import { createStackNavigator } from 'react-navigation';
import { Content, Container, Thumbnail, Form, Icon, Item, Input, Button } from 'native-base';
import { RNS3 } from 'react-native-aws3';
import { DefaultImg } from '../router';

const window = Dimensions.get('window');
const imageWidth = (window.width / 3) + 30;
const imageHeight = window.width / 3;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const CLUB_WIDTH = WIDTH * 4 / 10;
const CLUB_HEIGHT = HEIGHT / 4;

export default class ClubsPage extends Component {
  static navigationOptions = () => {
    return {
      header: null
    };
  }

  render() {
    return (
      <ClubPageNavigator screenProps={{ home: this.props.screenProps.home, clubPage: this.props.navigation }} />
    );
  }
}

class ShowClubs extends Component {
  constructor(props) { // Initializing state
    super(props);

    props.navigation.setParams({ refreshClubs: this.getUserClubs });
    props.navigation.setParams({ showAdmin: true })

    this.state = {
      clubsAdmin: [],
      clubsMember: [],
      tappedAdmin: false,
      validModal: false,
      show: false,
      loading: false,
      name: '',
      description: '',
      imageURL: DefaultImg
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerLeft: (
        <View style={{ marginLeft: 13 }}>
          <FontAwesome
            name="plus" size={32} color={'black'}
            onPress={() => navigation.navigate('CreateClub', { refreshClubs: navigation.state.params.refreshClubs })} />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 6 }}>
          <FontAwesome
            name="search" size={32} color={'black'}
            onPress={() => screenProps.clubPage.navigate('ClubSearch')} />
        </View>
      ),
      headerTitle: (
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
          <Button transparent onPress={() => navigation.setParams({ showAdmin: true })} >
            <Text style={[{ fontSize: 20, fontWeight: 'bold' }, !navigation.state.params ||
              navigation.state.params.showAdmin ? { color: '#59cbbd' } : {}]} >Admin</Text>
          </Button>
          <Text style={{ fontSize: 32, fontWeight: 'bold' }} >|</Text>
          <Button transparent onPress={() => navigation.setParams({ showAdmin: false })}>
            <Text style={[{ fontSize: 20, fontWeight: 'bold' }, navigation.state.params &&
              !navigation.state.params.showAdmin ? { color: '#59cbbd' } : {}]} >Member</Text>
          </Button>
        </View>
      )
    };
  };

  async componentWillMount() {
    await this.getUserClubs();
  };

  getUserClubs = async () => {
    this.setState({ loading: true });
    var getClubsAdmin = [];
    var getClubsMember = [];
    axios.get("http://localhost:3000/api/organizations").then((response) => {
      const { arrayClubsAdmin, arrayClubsMember } = response.data;
      getClubsAdmin = arrayClubsAdmin;
      for (var i = 0; i < arrayClubsAdmin.length; i++) {
        if (getClubsAdmin[i].image)
          url = 'https://s3.amazonaws.com/clubster-123/' + getClubsAdmin[i].image;
        else
          url = DefaultImg;
        getClubsAdmin[i].image = url;
        getClubsAdmin[i].isAdmin = true;
      };

      for (var i = 0; i < arrayClubsMember.length; i++) {
        var club = arrayClubsMember[i];
        if (arrayClubsMember[i].image)
          url = 'https://s3.amazonaws.com/clubster-123/' + arrayClubsMember[i].image;
        else
          url = DefaultImg;
        club.image = url;
        club.isAdmin = false;
        getClubsMember.push(club);
      };
      if (getClubsAdmin.length % 2 != 0)
        getClubsAdmin.push({ empty: true });
      if (getClubsMember.length % 2 != 0)
        getClubsMember.push({ empty: true });
      this.setState({ clubsAdmin: getClubsAdmin, clubsMember: getClubsMember }); // Setting up state variable
      this.setState({ loading: false });
    }).catch(() => { this.setState({ loading: false }); });
  };

  navigateUser = (item) => {
    this.props.screenProps.home.navigate('AdminMemNavigation', { item, isAdmin: item.isAdmin });
  };

  _renderItem = ({ item }) => {
    if (item.empty) {
      return <View style={[styles.eventContainer, { backgroundColor: 'transparent' }]} />;
    }
    return (
      <TouchableWithoutFeedback onPress={() => this.navigateUser(item)}
        style={{ flexDirection: 'row' }}>
        <View style={styles.eventContainer} >
          <Image style={styles.containerImage} source={{ uri: item.image }} />
          <View style={{ margin: 10 }}>
            <Text allowFontScaling numberOfLines={1}
              style={styles.eventTitle}> {item.name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    if (!this.props.navigation.state.params || this.props.navigation.state.params.showAdmin) {
      if (!this.state.loading && (!this.state.clubsAdmin || this.state.clubsAdmin.length == 0))
        return (
          <ScrollView refreshControl={<RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.getUserClubs}
          />}>
            <Text style={[{ flex: 1 }, styles.noneText]}>You are not an admin of any clubs</Text>
          </ScrollView>
        )
      return (
        <ScrollView refreshControl={<RefreshControl
          refreshing={this.state.loading}
          onRefresh={this.getUserClubs}
        />}>
          <FlatList
            data={this.state.clubsAdmin.slice(0, 40)}
            renderItem={this._renderItem}
            horizontal={false}
            numColumns={2}
            keyExtractor={club => club._id}
            extraData={this.state}
          />
        </ScrollView>
      )
    }
    else {
      if (!this.state.loading && (!this.state.clubsMember || this.state.clubsMember.length == 0))
        return (
          <ScrollView refreshControl={<RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.getUserClubs}
          />}>
            <Text style={[{ flex: 1 }, styles.noneText]}>You are not a member of any clubs</Text>
          </ScrollView>
        )
      return (
        <ScrollView refreshControl={<RefreshControl
          refreshing={this.state.loading}
          onRefresh={this.getUserClubs}
        />}>
          <FlatList
            data={this.state.clubsMember.slice(0, 40)}
            renderItem={this._renderItem}
            horizontal={false}
            numColumns={2}
            keyExtractor={club => club._id}
            extraData={this.state}
          />
        </ScrollView>
      )
    }
  }
}

class CreateClub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: 'https://facebook.github.io/react/logo-og.png',
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
        })
      }).catch((err) => { console.log(err) });
    } catch (error) { console.log(error); };
  };

  // modal for when user enters invalid fields 
  openValidModal() {
    this.setState({
      validModal: true
    })
  }

  closeValidModal() { this.setState({ validModal: false }) }

  // checks if any of the fields are empty. If any are, the
  // page will not change and it will ask for inputs again
  validateInput = () => {
    let errors = {};
    if (this.state != null) {
      const { name, description, imageURL } = this.state;
      if (name == '' || name == null)
        errors['name'] = 'Please enter a name for the club'
      if (description == '' || description == null)
        errors['description'] = 'Please enter a description'
      this.setState({ errors });
      if (Object.keys(errors).length == 0) {
        this.submit();
      }
      else {
        this.openValidModal();
      }
    }
  }

  submit = async () => {
    const { name, description, imageURL } = this.state;
    await axios.post('http://localhost:3000/api/organizations/new', {
      name, description, imageURL
    });
    var func = this.props.navigation.getParam('refreshClubs');
    if (func) {
      await func();
      this.props.navigation.navigate('ShowClubs');
    } else this.props.navigation.navigate('ShowClubs');
  }

  render() {
    let { errors = {} } = this.state;
    const { name, description } = this.state;
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
              <Thumbnail square large style={styles.imageThumbnail}
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
            <Text style={styles.modalContent}>
              {errors.name}
            </Text>
            <Text style={styles.modalContent}>
              {errors.description}
            </Text>
          </View>
        </Modal>

        <Button bordered
          onPress={this.validateInput}
          style={{
            margin: 20, width: 100,
            justifyContent: 'center', alignSelf: 'center'
          }}>
          <Text>Create Club!</Text>
        </Button>

      </Container>
    );
  }
}

const ClubPageNavigator = createStackNavigator(
  {
    ShowClubs: { screen: ShowClubs },
    CreateClub: { screen: CreateClub },
  },
  {
    navigationOptions: {
      headerBackImage: (<MaterialIcons name="arrow-back" size={32} color={'black'} />),
    }
  }
)

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    height: CLUB_HEIGHT,
    position: 'relative',
    backgroundColor: '#59cbbd',
    marginTop: 20,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 5,
  },
  containerImage: {
    alignItems: 'center',
    borderColor: '#d6d7da',
    flex: 1,
    borderRadius: 5,
  },
  eventTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  topButtons: {
    backgroundColor: '#E0E0E0',
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    marginVertical: 20,
  },
  uploadIcon: {
    alignSelf: 'center',
    margin: 10,
  },
  imageThumbnail: {
    margin: 20,
    alignSelf: 'center',
    borderRadius: 2,
<<<<<<< HEAD
    width: WIDTH/1.5,
    height: HEIGHT/3
=======
    width: WIDTH / 1.5,
    height: HEIGHT / 3
>>>>>>> 881d369ac9d8971214ab2ebe7c2ebf8608161d97
  },
  btn: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plus: {
    fontSize: 40,
    color: 'white'
  },
  item: {
    backgroundColor: '#009900',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 10,
    marginBottom: 10
  },
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  titleContainer: {
    flex: 0.1,
    paddingHorizontal: '2.5%',
    paddingVertical: '2.5%',
  },
  title: {
    color: '#fff',
    fontSize: 25,
  },
  contentContainer: {
    flex: 1,
  },
  meetupCard: {
    width: window.width / 2,
    alignItems: 'center',
    height: imageHeight + 5,
    marginTop: 10,
    borderColor: '#d6d7da'
  },
  meetupCardTopContainer: {
    flex: 1,
    position: 'absolute',
  },
  meetupCardTitle: {
    position: 'relative',
    color: '#0000ff'
  },
  meetupCardBottomContainer: {
    flex: 0.4,
    width: window.width / 2 - 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: '2.5%',

  },
  meetupCardMetaName: {
    fontSize: 15
  },
  meetupCardMetaDate: {
    fontSize: 13
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
  noneText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontSize: 16,
    marginTop: 10
  }
});
