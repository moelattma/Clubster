import React, { Component } from 'react';
import { Image, StyleSheet, Button, Text, TouchableOpacity, View, Dimensions, TouchableWithoutFeedback, FlatList } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import t from 'tcomb-form-native';
import { ImagePicker, Permissions, Font } from 'expo';
import converter from 'base64-arraybuffer';
import ImageFactory from 'react-native-image-picker-form';
import { createStackNavigator } from 'react-navigation';

const Form = t.form.Form;
const Organization = t.struct({
  Name: t.String,
  Abbreviation: t.String,
  Purpose: t.String,
  Description: t.String,
  image: t.String
})

type Props = {}
type State = {
  value: Object,
  options: Object
}

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
      loading: false,
      value: {},
      options: {
       fields: {
         image: {
           config: {
             title: 'Select image',
             options: ['Open camera', 'Select from gallery', 'Cancel'],
             style: {
               titleFontFamily: 'Roboto'
             }
           },
           error: 'No image provided',
           factory: ImageFactory
         }
       }
     }
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

  async componentWillMount() {
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
        getClubsAdmin[i].imageUrl = 'data:image/jpeg;base64,' + converter.encode(arrayClubsAdmin[i].imageId.img.data.data);
        getClubsAdmin[i].isAdmin = true;
      };

      for (var i = 0; i < arrayClubsMember.length; i++) {
        var club = arrayClubsMember[i];
        club.imageUrl = 'data:image/jpeg;base64,' + converter.encode(club.imageId.img.data.data);
        club.isAdmin = false;
        getClubsMember.push(club);
      };
      if (getClubsAdmin.length % 2 != 0)
        getClubsAdmin.push({ empty: true });
      if (getClubsMember.length % 2 != 0)
        getClubsMember.push({ empty: true });
      this.setState({ clubsAdmin: getClubsAdmin, clubsMember: getClubsMember, loading: false }); // Setting up state variable
    }).catch((err) => {
      console.log(err);
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
          <Image style={styles.imageHeight} source={{ uri: item.imageUrl }} />
          <Text allowFontScaling numberOfLines={1} style={styles.eventTitle}> {item.name} </Text>
          <Text style={{ position: 'absolute', right: 0, bottom: 0, fontSize: 12, fontWeight: 'bold' }}> {(item.isAdmin ? 'A' : 'M')} </Text>
          <Text style={{ position: 'absolute', left: 0, bottom: 0, fontSize: 12, fontWeight: 'bold' }}> {item.acronym} </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  returnValues = () => {
    console.log(this.state.value);
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
      value: {},
      options: {
       fields: {
         image: {
           config: {
             title: 'Select image',
             options: ['Open camera', 'Select from gallery', 'Cancel'],
             style: {
               titleFontFamily: 'Roboto'
             }
           },
           error: 'No image provided',
           factory: ImageFactory
         }
       }
     }
    }
  }
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
    if (result.cancelled)
      return;
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
      <Form
        ref={(ref: any) => {
          this.form = ref
        }}
        type={Organization}
        value={this.state.value}
        options={this.state.options}
      />
        <Button title="Sign Up!" onPress={this.returnValues} />
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
