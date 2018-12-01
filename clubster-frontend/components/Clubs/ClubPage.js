import React, { Component } from 'react';
import { Image, StyleSheet, Button, Text, View, Dimensions, TouchableWithoutFeedback, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import t from 'tcomb-form-native';
import { ImagePicker, Permissions } from 'expo';
import converter from 'base64-arraybuffer';

import { createStackNavigator } from 'react-navigation';

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

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');
const CLUB_WIDTH = WIDTH * 4 / 10;
const CLUB_HEIGHT = HEIGHT * 1 / 4;

export default class ClubsPage extends Component {
  static navigationOptions = ({ }) => {
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
  constructor() { // Initializing state
    super();
    this.state = {
      clubs: [],
      show: false,
      img: 'https://facebook.github.io/react/logo-og.png',
      loading: false
    }
  }

  static navigationOptions = ({ navigation, screenProps }) => {
    return {
      headerLeft: (
        <View style={{ marginLeft: 13 }}>
          <FontAwesome
            name="plus" size={32} color={'black'}
            onPress={() => navigation.navigate('CreateClub')} />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 6 }}>
          <FontAwesome
            name="search" size={32} color={'black'}
            onPress={() => screenProps.clubPage.navigate('ClubSearch')} />
        </View>
      )
    };
  };

  componentWillMount() {
    this.willFocus = this.props.navigation.addListener('willFocus', () => { this.getUserClubs(); });
  };

  getUserClubs = () => {
    this.setState({ loading: true });
    var getClubs = [];
    axios.get("http://localhost:3000/api/organizations").then((response) => {
      const { arrayClubsAdmin, arrayClubsMember } = response.data;
      getClubs = arrayClubsAdmin;

      for (var i = 0; i < arrayClubsAdmin.length; i++) {
        getClubs[i].imageUrl = 'data:image/jpeg;base64,' + converter.encode(arrayClubsAdmin[i].imageId.img.data.data);
        getClubs[i].isAdmin = true;
      };

      for (var i = 0; i < arrayClubsMember.length; i++) {
        var club = arrayClubsMember[i];
        club.imageUrl = 'data:image/jpeg;base64,' + converter.encode(club.imageId.img.data.data);
        club.isAdmin = false;
        getClubs.push(club);
      };
      if(getClubs.length % 2 != 0)
        getClubs.push({ empty: true });
      this.setState({ clubs: getClubs, loading: false }); // Setting up state variable
    }).catch((err) => {
      console.log(err); 
      this.setState({ loading: false });
    });
  };

  navigateUser = (item) => {
    this.props.screenProps.home.navigate('AdminMemNavigation', { item, isAdmin: item.isAdmin });
  };

  _renderItem = ({ item }) => {
    if(item.empty) {
      return <View style={[styles.eventContainer, { backgroundColor: 'transparent' }]} />;
    }
    return (
      <TouchableWithoutFeedback onPressIn={() => this.navigateUser(item)}>
        <View style={styles.eventContainer} >
          <Image style={styles.imageHeight} source={{ uri: item.imageUrl }} />
          <Text style={styles.eventTitle}> {item.name} </Text>
          <Text style={{ position: 'absolute', right: 0, bottom: 0, fontSize: 12, fontWeight: 'bold' }}> {(item.isAdmin ? 'A' : 'M')} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.clubs.slice(0, 40)}
        renderItem={this._renderItem}
        horizontal={false}
        numColumns={2}
        keyExtractor={club => club._id}
        refreshing={this.state.loading}
        onRefresh={this.getUserClubs}
      />
    );
  }
}

class CreateClub extends Component {
  askPermissionsAsync = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
  };

  useLibraryHandler = async () => {
    await this.askPermissionsAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
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
    await axios.post('http://localhost:3000/api/organizations/new', data);
    this.props.navigation.navigate('ShowClubs');
  };

  render() {
    return (
      <View>
        <Form type={Organization} ref={(ref) => this._formRef = ref} />
        <Button title="Sign Up!" onPress={this.useLibraryHandler} />
      </View>
    );
  }
}

const ClubPageNavigator = createStackNavigator(
  {
    ShowClubs: { screen: ShowClubs },
    CreateClub: { screen: CreateClub }
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
    backgroundColor: '#59cbbd',
    marginTop: 10,
    marginRight: 4,
    marginLeft: 4
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
