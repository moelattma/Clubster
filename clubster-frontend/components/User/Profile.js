import React, { Component } from 'react';
import { AsyncStorage, View, ScrollView, StyleSheet,
     Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Expo, { Font, ImagePicker, Permissions } from 'expo';
import axios from 'axios';
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Gallery from './Cards/Gallery';
import InformationCard from './Cards/InformationCard';
import { accessKeyId, secretAccessKey } from '../../keys/keys';
import v1 from 'uuid/v1';
import { RNS3 } from 'react-native-aws3';
import ClubList from './Cards/ClubList';
import { Thumbnail, Content, Container, Button, Text } from 'native-base';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

const SELECT_ABOUT = 0;
const SELECT_PHOTOS = 1;
const SELECT_CLUBS = 2;

export default class Profile extends Component {
    constructor() {
        super();

        this.state = {
            show: false,
            result: null,
            name: '',
            img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK////bG9zSk9T/v7+/f39/f3+9vf3O0BETlJWNzxB/Pz8d3t+TFFVzM3O1NXX7u/vUldbRElNs7W3v8HCmZyeRkpPW19j8vLy7u7vvsDC9PT1cHR3Oj9Eo6WnxsjJR0tQOD1Bj5KVgYSHTVFWtri50dLUtLa4YmZqOT5D8vPzRUpOkZOWc3Z64uPjr7Gzuru95+jpX2NnaGxwPkNHp6mrioyPlZeadXh8Q0hNPEBFyszNh4qNc3d6eHx/OD1Cw8XGXGBkfoGEra+xxcbIgoaJu72/m52ggoWIZ2tu8/P0wcLE+vr7kZSXgIOGP0NIvr/BvL6/QUZKP0RJkpWYpKaoqKqtVVldmJqdl5qcZWhstbe5bHB0bnJ1UVVZwsTF5ubnT1RYcHN3oaSm3N3e3NzdQkdLnJ+h9fX1TlNX+Pj47/DwwsPFVFhcEpC44wAAAShJREFUeNq8k0VvxDAQhZOXDS52mRnKzLRlZmZm+v/HxmnUOlFaSz3su4xm/BkGzLn4P+XimOJZyw0FKufelfbfAe89dMmBBdUZ8G1eCJMba69Al+AABOOm/7j0DDGXtQP9bXjYN2tWGQfyA1Yg1kSu95x9GKHiIOBXLcAwUD1JJSBVfUbwGGi2AIvoneK4bCblSS8b0RwwRAPbCHx52kH60K1b9zQUjQKiULbMDbulEjGha/RQQFDE0/ezW8kR3C3kOJXmFcSyrcQR7FDAi55nuGABZkT5hqpk3xughDN7FOHHHd0LLU9qtV7r7uhsuRwt6pEJJFVLN4V5CT+SErpXt81DbHautkpBeHeaqNDRqUA0Uo5GkgXGyI3xDZ/q/wJMsb7/pwADAGqZHDyWkHd1AAAAAElFTkSuQmCC',
            major: '',
            hobbies: '',
            biography: '',
            errors: {},
            images: [],
            selected: SELECT_ABOUT,
            _loading: true
        }
    }

    async componentWillMount() {
        axios.get('http://localhost:3000/api/profile').then((response) => {
            const { name, image, major, biography, hobbies, photos } = response.data.profile;
            if (response.data.profile) {
                this.setState({ name: name, major: major ? major: '', photos: photos, biography: biography ? biography : '',
                    hobbies: hobbies ? hobbies.join(" ") : '', img: 'https://s3.amazonaws.com/clubster-123/' + image });
            }
        });

        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        });
        this.setState({ _loading: false });
    }

    handleAboutAction = () => { if (this.state.selected != SELECT_ABOUT) this.setState({ selected: SELECT_ABOUT }) }
    handlePhotoAction = () => { if (this.state.selected != SELECT_PHOTOS) this.setState({ selected: SELECT_PHOTOS }) }
    handleClubsAction = () => { if (this.state.selected != SELECT_CLUBS) this.setState({ selected: SELECT_CLUBS }) }

    hide = () => { return; }

    _showModal = () => this.setState({ show: true })
    _hideModal = () => this.setState({ show: false })

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('jwtToken');
            delete axios.defaults.headers.common['Authorization'];
            this.props.screenProps.logoutNavigation.navigate('Login');
        }
        catch (exception) {
            console.log(exception);
            return false;
        }
    }

    submitProfile() {
        var hobbiesList = this.state.hobbies.split(',');
        var removeIndices = [];

        for (var i = 0; i < hobbiesList.length; i++) {
            hobbiesList[i] = hobbiesList[i].trim();
            if (hobbiesList[i] == "")
                removeIndices.push(i);
        }

        var splicedCount = 0;
        removeIndices.map(index => hobbiesList.splice(index - splicedCount++));

        axios.post('http://localhost:3000/api/profile', {
            major: this.state.major, hobbies: hobbiesList,
            facebook: this.state.facebook, instagram: this.state.instagram,
            linkedIn: this.state.linkedIn, biography: this.state.biography
        }).then((response) => {
            if (response.status == 201 || response.status == 200) {
                this.setState({ show: false, hobbies: hobbiesList.join(', ') });
            }
        })
    }

    changePicture = async () => {
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
            var imageURL;
            await RNS3.put(file, options).then((response) => {
                imageURL = response.body.postResponse.key;
            }).catch((err) => { console.log(err) });
            await axios.post('http://localhost:3000/api/changePhoto', { imageURL: imageURL }).then((response) => {
                this.setState({ img: 'https://s3.amazonaws.com/clubster-123/' + response.data.image });
            });
        } catch (error) { console.log(error); }
    };

    async photoSubmit() {
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
          var imageURL;
          await RNS3.put(file, options).then((response) => {
              imageURL = response.body.postResponse.key;
          }).catch((err) => { console.log(err) });
          axios.post('http://localhost:3000/api/profile/photo', {imageURL: imageURL}).then((response) => {
              this.setState({images:response.data.photos});
          });
        } catch (error) { console.log(error); }
        axios.post('http://localhost:3000/api/profile/photo').then((response) => {
            this.setState({images:response.data.photos});
        });
    };

    renderElement = (d, i) => (
        <View key={i}
            style={{
                justifyContent: "center", alignItems: "center",
                borderWidth: 1, borderColor: "#898989",
                backgroundColor: "white", borderRadius: 12,
                margin: 3, height: 24
            }}
        >
            <Text style={{ marginHorizontal: 8, fontSize: 16, color: "#898989" }}>
                {d}
            </Text>
        </View>
    )


    render() {
        if (this.state._loading)
            return <Expo.AppLoading/>;

        return (
            <ScrollView>
                <View style={{ height: HEIGHT / 4, backgroundColor: '#59cbbd' }}>
                    <TouchableOpacity style={{ position: 'absolute', left: 4, top: 10 }} onPress={() => this.handleLogout()} >
                        <MaterialCommunityIcons
                            name="logout"
                            size={35}
                            color={'red'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={this._showModal} >
                        <MaterialCommunityIcons
                            name="account-edit"
                            size={35}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.avatar} onPress={this.changePicture}>
                    <Thumbnail style={styles.imageAvatar} source={{ uri: this.state.img }} />
                </TouchableOpacity>
                <View style={{height: 100}}></View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Button bordered activeOpacity={0.5} style={styles.buttonText} 
                        onPress={this.handleAboutAction.bind(this)}>
                            <Text>About</Text>
                        </Button>
                        <Button bordered style={styles.buttonText} 
                        onPress={this.handlePhotoAction.bind(this)}>
                            <Text>Photos</Text>
                        </Button>
                        <Button bordered style={styles.buttonText} 
                        onPress={this.handleClubsAction.bind(this)}>
                            <Text>Clubs</Text>
                        </Button >
                        </View>

                {(this.state.selected == SELECT_ABOUT)
                    //about tab
                    ? <InformationCard userInfo = {this.state} />
                    //photos tab
                    : ((this.state.selected == SELECT_PHOTOS)
                        ? <Gallery userPhotos = {this.state} />
                        //clubs tab
                        :
                        <ClubList />
                    )}
                {/* MODAL  */}
                <View style={{ flex: 1 }}>
                    <Modal isVisible={this.state.show} onRequestClose={this.hide}>
                        <View style={styles.modalView}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                Edit Profile
                            </Text>
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Major" onChangeText={(major) => this.setState({ major })} value={this.state.major} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Hobbies (seperated by ,)" onChangeText={hobbies => this.setState({ hobbies })} value={this.state.hobbies} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Facebook" onChangeText={(facebook) => this.setState({ facebook })} value={this.state.facebook} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="Instagram" onChangeText={(instagram) => this.setState({ instagram })} value={this.state.instagram} />
                            <TextInput style={{ alignSelf: 'stretch', padding: 3 }} placeholder="LinkedIn" onChangeText={(linkedIn) => this.setState({ linkedIn })} value={this.state.linkedIn} />
                            <TextInput multiline={true} numberOfLines={6} style={{ width: 350 }} placeholder="Decribe yourself!" onChangeText={(biography) => this.setState({ biography })} value={this.state.biography} />

                            <TouchableOpacity onPress={() => { this.submitProfile() }}>
                                <Text style={styles.SubmitBtn}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { this.setState({ show: false }) }}>
                                <Text style={styles.closeText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#338293',
        margin: 10,
        width: '27%'
    },
    header: {
        backgroundColor: "#00BFFF",
        height: 200,
    },
    avatar: {
        width: WIDTH / 3,
        height: WIDTH / 3,
        borderRadius: WIDTH / 6,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: HEIGHT / 4 - WIDTH / 6
    },
    imageAvatar: {
        width: WIDTH / 3,
        height: WIDTH / 3,
        borderColor: 'white',
        borderRadius: WIDTH / 6,
        alignSelf: 'center',
        position: 'relative'
    },
    background: {
        flex: 1,
        height: 200,
        backgroundColor: 'lightgreen'
    },
    tContainer: {
        flex: 1,
        backgroundColor: '#3399ff',
        paddingTop: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        backgroundColor: "#fff",
        height: 500,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeText: {
        backgroundColor: '#ff6666',
        color: '#fff',
        fontWeight: 'bold',
        padding: 5
    },
    SubmitBtn: {
        backgroundColor: 'skyblue',
        color: '#fff',
        fontWeight: 'bold',
        margin: 5,
        padding: 5
    },
    header: {
        backgroundColor: 'lightgreen',
        marginBottom: 1000,
    },
    profilePic: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -40, 
    },
    profilePicWrap: {
        width: 180,
        height: 180,
        borderRadius: 100,
        zIndex: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0,0,0, 0.4)',
        borderWidth: 16,
        position: 'absolute',
    },

    profilepic: {
        flex: 1,
        width: null,
        alignSelf: 'stretch',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 4,
    },
    editButton: {
        position: 'absolute',
        right: 4,
        top: 10
    }
});
