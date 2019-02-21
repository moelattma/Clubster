import React, { Component } from 'react';
import { Image, StyleSheet, Button, Text, TouchableOpacity, View, Dimensions, TouchableWithoutFeedback, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import t from 'tcomb-form-native';
import { ImagePicker, Permissions, Font } from 'expo';
import converter from 'base64-arraybuffer';
import v1 from 'uuid/v1';
import {accessKeyId, secretAccessKey} from '../../keys/keys';
import { createStackNavigator } from 'react-navigation';
import { RNS3 } from 'react-native-aws3';

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
      clubsAdmin: [],
      clubsMember: [],
      tappedAdmin: false,
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
      ),
      headerTop: (
        <View style={{ marginTop: 43 }}>
          <FontAwesome
            name="plus" size={32} color={'black'}
            onPress={() => navigation.navigate('CreateClub')} />
        </View>
      )
    };
  };

  componentWillMount() {
    this.willFocus = this.props.navigation.addListener('willFocus', () => { this.getUserClubs(); });
  };

  getUserClubs = () => {
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
          url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC';
        getClubsAdmin[i].image = url;
        getClubsAdmin[i].isAdmin = true;
      };

      for (var i = 0; i < arrayClubsMember.length; i++) {
        var club = arrayClubsMember[i];
        club.image = url;
        club.isAdmin = false;
        getClubsMember.push(club);
      };
      if (getClubsAdmin.length % 2 != 0)
        getClubsAdmin.push({ empty: true });
      if (getClubsMember.length % 2 != 0)
        getClubsMember.push({ empty: true });
      this.setState({ clubsAdmin: getClubsAdmin, clubsMember: getClubsMember, loading: false }); // Setting up state variable
    }).catch((err) => {
      this.setState({ loading: false });
    });
  };

  navigateUser = (item) => {
    this.props.screenProps.home.navigate('AdminMemNavigation', { item, isAdmin: item.isAdmin });
  };

  _renderItem = ({ item }) => {
    if (item.empty) {
      return <View style={[styles.eventContainer, { backgroundColor: 'transparent' }]} />;
    }
    return (
      <TouchableWithoutFeedback onPressIn={() => this.navigateUser(item)} style={{ flex: 1, flexDirection: 'row' }}>
        <View style={styles.eventContainer} >
          <Image style={styles.imageHeight} source={{ uri: item.image }} />
          <Text allowFontScaling numberOfLines={1} style={styles.eventTitle}> {item.name} </Text>
          <Text style={{ position: 'absolute', right: 0, bottom: 0, fontSize: 12, fontWeight: 'bold' }}> {(item.isAdmin ? 'A' : 'M')} </Text>
          <Text style={{ position: 'absolute', left: 0, bottom: 0, fontSize: 12, fontWeight: 'bold' }}> {item.acronym} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

   _renderBanner = () => {
     return (
       <View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: 0, alignSelf: 'center', justifyContent: 'space-evenly', backgroundColor: 'darkblue', width: WIDTH}}>
           <TouchableOpacity onPressIn={() => this.toggleAdmin(false)} style={styles.button} >
             <Text style={styles.itemText}> Member </Text>
           </TouchableOpacity>
           <TouchableOpacity onPressIn={() => this.toggleAdmin(true)} style={styles.button} >
            <Text style={styles.itemText}> Admin </Text>
           </TouchableOpacity>
       </View>
     );
   }

  toggleAdmin = (tapped) => {
    this.setState({ tappedAdmin: tapped });
  }

  _renderClubs = () => {
    if (this.state.tappedAdmin) {
      return (
        <FlatList
          data={this.state.clubsAdmin.slice(0, 40)}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          keyExtractor={club => club._id}
          refreshing={this.state.loading}
          onRefresh={this.getUserClubs}
        />)
    }
    else {
      return (
        <FlatList
          data={this.state.clubsMember.slice(0, 40)}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={2}
          keyExtractor={club => club._id}
          refreshing={this.state.loading}
          onRefresh={this.getUserClubs}
        />)
    }
  }

  render() {
    return (
      <View>
        {this._renderClubs()}
        {this._renderBanner()}
      </View>
    );
  }
}

class CreateClub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: 'https://facebook.github.io/react/logo-og.png',
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
      var imageURL;
      await RNS3.put(file,options).then((response)=> {
         imageURL = response.body.postResponse.key;
      }).catch((err) => {console.log(err)});
      const data = new FormData();
      data.append('name', this._formRef.getValue().Name);
      data.append('acronym', this._formRef.getValue().Abbreviation);
      data.append('purpose', this._formRef.getValue().Purpose);
      data.append('description', this._formRef.getValue().Description);
      data.append('imageURL', imageURL);
      axios.post('http://localhost:3000/api/organizations/new', data);
      this.props.navigation.navigate('ShowClubs');
    } catch(error) {
      console.log(error);
    };
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
    marginTop: 90,
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
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#338293',
    margin: 10,
    width: '27%'
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
