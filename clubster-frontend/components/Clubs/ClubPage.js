import React, { Component } from 'react';
import { ScrollView, AsyncStorage, TouchableOpacity, Image, StyleSheet, Button, Text, View, Dimensions, FlatList, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ClubsUI from './ClubsUI';
import axios from 'axios';
import t from 'tcomb-form-native';
import { ImagePicker, Permissions, Constants } from 'expo';
import converter from 'base64-arraybuffer';
import { update } from 'tcomb';

const Form = t.form.Form;
const Organization = t.struct({
  Name: t.String,
  Abbreviation: t.String,
  Purpose: t.String,
  Description: t.String
});

const window = Dimensions.get('window');
const imageWidth = (window.width / 3) + 30;
const imageHeight = window.width / 3;

export default class ClubsPage extends Component {

  constructor() { // Initializing state
    super();
    this.state = {
      clubs: [],
      show: false,
      img: 'https://facebook.github.io/react/logo-og.png'
    }
  }

  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // you would probably do something to verify that permissions
    // are actually granted, but I'm skipping that for brevity
  };

  useLibraryHandler = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
    const token = await AsyncStorage.getItem('jwtToken');
    const data = new FormData();
    data.append('name', this._formRef.getValue().Name);
    data.append('acronym', this._formRef.getValue().Abbreviation);
    data.append('purpose', this._formRef.getValue().Purpose);
    data.append('description', this._formRef.getValue().Description);
    data.append('fileData', {
      uri: result.uri,
      type: 'multipart/form-data',
      name: "image1.jpg"
    });
    axios.post('http://localhost:3000/api/organizations/new', data).then((response) => {
      var updatedClubs = this.state.clubs;
      const org = response.data.organization;
      updatedClubs.push({
        president: org.president,
        admins: org.admins,
        name: org.name,
        acronym: org.acronym,
        description: org.description,
        imageUrl: 'data:image/jpeg;base64,' + converter.encode(org.imageId.img.data.data),
        purpose: org.purpose,
        members: org.members,
        events: org.events
      });
      this.setState({ clubs: updatedClubs });
      this.setState({ show: false });
    });
  };

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <View style={{ marginRight: 6 }}>
          <FontAwesome name="search" onPress={() => navigation.navigate('ClubSearch')} size={28} />
        </View>
      ),
    };
  };

  renderItem = ({ item, index }) => {
    if (item.hasOwnProperty('empty') && item.empty === true) {
      return <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}><View style={[styles.item, styles.itemInvisible]} /></TouchableWithoutFeedback>;
    }
    const { screenProps } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => { screenProps.home.navigate('AdminNavigation') }}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  handleSubmit = () => {
    const name = this._formRef.getValue().Name;
    const acronym = this._formRef.getValue().Abbreviation;
    const purpose = this._formRef.getValue().Purpose;
    const description = this._formRef.getValue().Description;
    axios.post('http://localhost:3000/api/organizations/new', { name: name, acronym: acronym, purpose: purpose, description: description }).then((organization) => {
      this.setState({ show: false });
      this.setState({ clubs: this.state.clubs.concat(organization.data) });
    }).catch((error) => {
      console.log(error);
    });
  }

  componentDidMount() {
    var getClubs = [];
    axios.get("http://localhost:3000/api/organizations").then((response) => {
      const { user } = response.data;
      arr = user.arrayClubsAdmin;

      for(var i = 0; i < user.arrayClubsAdmin.length; i++) {
        const club = user.arrayClubsAdmin[i];
        arr[i].imageUrl = 'data:image/jpeg;base64,' + converter.encode(club.imageId.img.data.data);
        arr[i].isAdmin = true;
      };

      for(var i = 0; i < user.arrayClubsMember.length; i++) {
        const club = user.arrayClubsMember[i];
        club.imageUrl = 'data:image/jpeg;base64,' + converter.encode(club.imageId.img.data.data);
        club.isAdmin = false;
        arr.push(club);
      };
      this.setState({ clubs: arr }); // Setting up state variable
    }).catch((err) => console.log(err));
  };

  navigateUser = (item) => {
    this.props.screenProps.home.navigate('AdminMemNavigation', { item, isAdmin: item.isAdmin });
  }

  renderElement() {
    if (this.state.show == true) {
      return (
        <View>
          <Form type={Organization} ref={(ref) => this._formRef = ref} />
          <Button title="Sign Up!" onPress={this.useLibraryHandler} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.root}>
          {this.state.clubs.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => this.navigateUser(item)} >
              <View style={styles.meetupCard} >
                <View style={styles.meetupCardTopContainer}>
                  <Image style={styles.imageHeight} source={{ uri: item.imageUrl }} />
                </View>

                <View style={styles.meetupCardBottomContainer}>
                  <Text style={styles.meetupCardMetaName}>
                    {item.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.btn} onPress={() => { this.setState({ show: true }); }}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderElement()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 82,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    flex: 1,
    marginVertical: 20,
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
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
  imageHeight: {
    width: window.width / 2,
    alignItems: 'center',
    height: imageHeight,
    borderColor: '#d6d7da'
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
  }
});
